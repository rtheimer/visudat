import os, re, json
import pandas as pd
from email_validator import validate_email, EmailNotValidError
from .pd_data_converter import PowerDog
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from .models import Plant, Owner, Datalogger, DataBuses
from .serializers import (
    PlantSerializer,
    OwnerSerializer,
    UserSerializer,
    DataloggerSerializer,
    DataBusesSerializer,
    InverterSerializer,
)
from django.contrib.auth.models import User
from rest_framework import status, permissions, authentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from django.conf import settings

# Constants for HTTP methods and their corresponding actions
# GET    => READ
# POST   => CREATE
# DELETE => DELETE
# PUT    => UPDATE

# TODO: Convert all views to class-based views


# Utility function to read CSV data and convert to JSON
def read_csv_to_json(_):
    """
    Reads CSV data from PowerDog, converts it to a pandas DataFrame,
    and returns the data as JSON.

    Parameters:
    - _: Placeholder for Django request (not used)

    Returns:
    - HttpResponse: JSON response containing the data
    """
    print(os.getcwd())
    # Read CSV file into pandas DataFrame
    datahandler = PowerDog(settings.UPLOAD_DIRECTORY, "PD809-00051")
    year = datahandler.dataframe_year("B8", "A2", "S2")

    # Convert DataFrame to JSON
    json_data = year.to_json()

    # Return JSON response
    return HttpResponse(json_data, content_type="application/json")


class Owners(APIView):
    """
    API endpoint to manage PV Owners.
    """

    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, format=None) -> Response:
        """
        Handles GET requests to retrieve PV owners based on provided parameters.

        Parameters:
        - request: Django request object
        - format: Format of the response (not used)

        Returns:
        - Response: JSON response containing PV owners data
        """
        owner_name = request.GET.get("name")
        first_name = request.GET.get("first_name")
        email = request.GET.get("email")

        """ 
        QuerySets are lazy – the act of creating a QuerySet doesn't involve any database activity.
        You can stack filters together all day long, and Django won't actually run the query
        until the QuerySet is evaluated.
        """

        # Start with a base queryset
        owners = Owner.objects.all()

        # Check if owner_name is provided
        if owner_name:
            owners = owners.filter(full_name__icontains=owner_name)
            if not owners:
                return Response(
                    {"error": "keine Ergebnis"}, status.HTTP_400_BAD_REQUEST
                )

        # Check if first_name is provided
        if first_name:
            owners = owners.filter(first_name__icontains=first_name)
            if not owners:
                return Response(
                    {"error": "keine Ergebnis"}, status.HTTP_400_BAD_REQUEST
                )

        # check if email is provided
        if email:
            owners = owners.filter(email__icontains=email)
            if not owners:
                return Response(
                    {"error": "keine Ergebnis"}, status.HTTP_400_BAD_REQUEST
                )

        serializer = OwnerSerializer(owners, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Handles POST requests to create a new PV owner.

        Parameters:
        - request: Django request object

        Returns:
        - Response: Placeholder for the response
        """

        data = request.data
        email = data["email"]
        full_name = data["full_name"]
        first_name = data["first_name"]

        if not 3 <= len(full_name) <= 70:
            return Response(
                {"error": "Name mind. 3 Zeichen max. 70"},
                status.HTTP_400_BAD_REQUEST,
            )
        if not 3 <= len(first_name) <= 70:
            return Response(
                {"error": "Vorname mind. 3 Zeichen max 70 Char."},
                status.HTTP_400_BAD_REQUEST,
            )

        if not email:
            return Response(
                {"error": "email fehlt"},
                status.HTTP_400_BAD_REQUEST,
            )
        else:
            try:
                # Check that the email address is valid. Turn on check_deliverability
                # for first-time validations like on account creation pages (but not
                # login pages).
                emailinfo = validate_email(
                    email, check_deliverability=True, allow_smtputf8=False
                )

                # After this point, use only the normalized form of the email address,
                # especially before going to a database query.
                email = emailinfo.normalized
                email = emailinfo.ascii_email

            except EmailNotValidError as e:
                return Response(
                    {"error": str(e)},
                    status.HTTP_400_BAD_REQUEST,
                )

        owner_exists = Owner.objects.filter(email=email)

        if not owner_exists:
            serializer = OwnerSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)

        else:
            return Response(
                {"error": "Email Adresse existiert bereits"},
                status.HTTP_400_BAD_REQUEST,
            )

    def put(self, request, pk=None):
        """
        Handles PUT requests to update PV owner data.

        Parameters:
        - request: Django request object

        Returns:
        - Response: Placeholder for the response
        """
        data = request.data
        if pk is None:
            return Response(
                {"error": "kein Datensatz zum updaten"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            pk = int(pk)
            print(pk)
        except (ValueError, TypeError):
            return Response(
                {"error": "update not allowed"}, status.HTTP_400_BAD_REQUEST
            )

        owner_exists = Owner.objects.get(pk=pk)

        if owner_exists:
            owner = Owner.objects.get(
                pk=pk
            )  # Get the first matching owner instance
            serializer = OwnerSerializer(owner, data=data)
            serializer.is_valid()
            print(serializer.errors)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print(serializer.data)
                return Response(serializer.data)

    def delete(self, request, pk=None):
        """
        Handles DELETE requests to delete a PV owner.

        Parameters:
        - request: Django request object

        Returns:
        - Response: Placeholder for the response
        """
        if pk is None:
            return Response(
                {"error": "nothing to delete"}, status.HTTP_400_BAD_REQUEST
            )
        owner = Owner.objects.get(pk=pk)
        owner.delete()

        return Response(None, status.HTTP_200_OK)


class Plants(APIView):
    """
    API endpoint that returns all PV Plants.
    """

    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """
        Handles GET requests to retrieve PV plants based on provided parameters.

        Parameters:
        - request: Django request object
        - format: Format of the response (not used)

        Returns:
        - Response: JSON response containing PV plants data
        """
        plant_name = request.GET.get("plant_name")
        plant_location = request.GET.get("plant_location")
        plant_owners = request.GET.get("plant_owners")

        print(plant_owners)

        # Start with a base queryset
        plants = Plant.objects.all()

        # Check if plant_name is provided
        if plant_name:
            plants = plants.filter(plant_name__icontains=plant_name)
            if not plants:
                return Response(
                    {"error": "keine Ergebnis"}, status.HTTP_400_BAD_REQUEST
                )

        # Check if plant_location is provided
        if plant_location:
            plants = plants.filter(plant_location__icontains=plant_location)
            if not plants:
                return Response(
                    {"error": "keine Ergebnis"}, status.HTTP_400_BAD_REQUEST
                )

        # check if owners are provided
        if plant_owners:
            plant_owners = [int(x) for x in plant_owners.split(",")]
            plants = plants.filter(owners__id__in=plant_owners).distinct()
            if not plants:
                print(plants)
                return Response(
                    {"error": "keine Ergebnis"}, status.HTTP_400_BAD_REQUEST
                )

        serializer = PlantSerializer(plants, many=True)

        return Response(serializer.data)

    def post(self, request):
        data = request.data
        owners = data["plant_owners"]

        serializer = PlantSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            plant_instance = serializer.save()
            plant_instance.owners.set(owners)
            return Response(serializer.data)

        return Response(None)

    def put(self, request, pk):
        data = request.data
        plant_exists = Plant.objects.get(pk=pk)
        owners = data["plant_owners"]

        if plant_exists:
            serializer = PlantSerializer(plant_exists, data=data)
            if serializer.is_valid(raise_exception=True):
                plant_instance = serializer.save()
                plant_instance.owners.set(owners)
                return Response(serializer.data)

    def delete(self, request, pk):
        plant = Plant.objects.get(pk=pk)
        plant.delete()
        return Response(None, status.HTTP_200_OK)


class DataLoggers(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        serial = request.GET.get("datalogger_serial")
        plants = request.GET.get("plants")

        # Start with a base queryset
        loggers = Datalogger.objects.all()

        # check if serial is provided
        if serial:
            loggers = loggers.filter(datalogger_serial__icontains=serial)

        # check if plants are provided
        if plants:
            plants = [int(x) for x in plants.split(",")]
            loggers = loggers.filter(plants__id__in=plants).distinct()

        serializer = DataloggerSerializer(loggers, many=True)

        return Response(serializer.data)

    def post(self, request):
        data = request.data
        plants = data["plants"]
        serial_provided = data["datalogger_serial"]

        # check format ^PD\d{3}-000\d{2}$
        if not re.match(r"^PD\d{3}-000\d{2}$", serial_provided):
            return Response(
                {"error": "Falsche Seriennummer"}, status.HTTP_400_BAD_REQUEST
            )

        # check if at least one plant is provided
        if not plants:
            return Response(
                {"error": "bitte eine PV Anlage auswählen"},
                status.HTTP_400_BAD_REQUEST,
            )

        # check if datalogger already exists
        datalogger_exists = Datalogger.objects.filter(
            datalogger_serial=serial_provided
        ).exists()
        print(datalogger_exists)
        if datalogger_exists:
            return Response(
                {"error": "Der Datenlogger wurde bereits angelegt"},
                status.HTTP_400_BAD_REQUEST,
            )

        # get the buses_configured
        # check if there is the config
        datalogger_config = PowerDog(
            settings.UPLOAD_DIRECTORY, data["datalogger_serial"]
        )

        try:
            configs = datalogger_config.filter_conf()
        except Exception as e:
            return Response(
                {"error": "File not found"}, status.HTTP_400_BAD_REQUEST
            )
        buses_configured = configs[0].to_json()
        data["buses_configured"] = buses_configured
        print(data)

        serializer = DataloggerSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            datalogger_instance = serializer.save()
            datalogger_instance.plants.set(plants)

            return Response(serializer.data)

    def put(self, request, pk):
        data = request.data
        datalogger_exists = Datalogger.objects.get(pk=pk)
        plants = data["plants"]
        if datalogger_exists:
            data["buses_configured"] = datalogger_exists.buses_configured
            serializer = DataloggerSerializer(datalogger_exists, data=data)
            serializer.is_valid()
            print(serializer.errors)
            if serializer.is_valid():
                datalogger_instance = serializer.save()
                datalogger_instance.plants.set(plants)
                return Response(serializer.data)

    def delete(self, request, pk):
        datalogger = Datalogger.objects.get(pk=pk)
        datalogger.delete()
        return Response(None, status.HTTP_200_OK)


class DataLoggerBuses(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data_bus_name = request.GET.get("data_bus_name")
        plant = request.GET.get("plant_id")
        datalogger = request.GET.get("datalogger")
        print(datalogger)
        # Start with a base queryset
        buses = DataBuses.objects.all()

        # check if data_bus_name is provided
        if data_bus_name:
            buses = buses.filter(data_bus_name__icontains=data_bus_name)
        if plant:
            buses = buses.filter(plant__id__icontains=plant)
        if datalogger:
            buses = buses.filter(datalogger__id__icontains=datalogger)

        serializer = DataBusesSerializer(buses, many=True)

        return Response(serializer.data)

    def post(self, request):
        # TODO: Implement handling when 'id' is not provided in the request data

        # Extract necessary data from the incoming HTTP request
        data = request.data
        if data["id"]:
            return Response(None, status.HTTP_304_NOT_MODIFIED)
        plant_id = data["plant_id"]
        plant_obj = Plant.objects.get(pk=plant_id)

        datalogger_id = data["datalogger"]
        # Get the corresponding datalogger Query Object by id
        datalogger_obj = Datalogger.objects.get(pk=datalogger_id)

        # Extract the bus number from the request object
        bus = data["data_bus_name"]
        pattern = r"\d+"
        bus_number = re.findall(pattern, bus)
        bus_number = int(bus_number[0])

        # Get the buses configured from the datalogger Query Object as a dictionary
        config = json.loads(datalogger_obj.buses_configured)

        # Get the serial of the datalogger from the datalogger Query Object
        serial = datalogger_obj.datalogger_serial

        # Convert the buses configured dictionary into a pandas DataFrame
        df = pd.DataFrame.from_dict(config)

        # Get the 'LastAddress' value for the specified bus number from the DataFrame
        last_address = df.set_index("Parameter").to_dict(orient="index")[
            f"LastAddress_B{bus_number}"
        ]["ParameterValue"]

        # set data
        data["bus_last_address"] = int(last_address)

        # Now we have the datalogger Serial, the bus number, and the bus LastAddress

        # Fetch all the inverter configurations for the corresponding datalogger Serial as a DataFrame
        datalogger_config = PowerDog(settings.UPLOAD_DIRECTORY, serial)
        df_inverter_configs = datalogger_config.filter_conf()[2]

        # Set the 'Parameter' column as the index and convert the DataFrame to a dictionary
        # {Index0: {'ParameterValue': value}, Index1: {'ParameterValue': 'value'}}
        inverter_configs = df_inverter_configs.set_index("Parameter").to_dict(
            orient="index"
        )

        # Get all items from the dictionary as a view object with a list of tuples
        # [(Index0: {ParameterValue: value}), (Index1: {ParameterValue: value})]
        items = inverter_configs.items()

        # The inverters dictionary {'Index0': 'value', 'Index1': 'value'}
        inverters = {}

        # Loop over the items
        for key, value in items:
            if value["ParameterValue"]:
                parameter_value = value.get("ParameterValue")
                if not pd.isna(parameter_value):
                    inverters[key] = parameter_value

        # Loop over inverters for every bus address up to last address

        # Insert into the 'Inverter' model (busAddress,inverter_strings, config.json, plant)
        for address in range(int(last_address)):
            inverter_config = {}
            inverter = {
                "inverter_bus_address": address + 1,
                "inverter_strings": 0,
                "inverter_configured": "",
            }
            for key, value in inverters.items():
                if key.startswith(f"Inverter_B{bus_number}_A{address + 1}_"):
                    inverter_config[key] = value
                    if key == f"Inverter_B{bus_number}_A{address + 1}_Strings":
                        inverter["inverter_strings"] = value
            inverter["inverter_configured"] = inverter_config

            # Create an instance of the 'InverterSerializer' with the provided data
            serializer_inverter = InverterSerializer(data=inverter)

            # Check if the serializer is valid before saving
            if serializer_inverter.is_valid():
                # Save the 'Inverter' instance to the database, associating it with the 'plant'
                serializer_inverter.save(plant=plant_obj)

            # Print the current inverter data
            print(inverter)

        # Create an instance of the 'DataBusesSerializer' with the provided data
        serializer = DataBusesSerializer(data=data)
        serializer.is_valid()
        print(serializer.errors)
        # Check if the serializer is valid before saving
        if serializer.is_valid():
            # Save the 'DataBuses' instance to the database, associating it with the 'plant' and 'datalogger'
            serializer.save(plant=plant_obj, datalogger=datalogger_obj)

            # Return a response containing the serialized data
            return Response(serializer.data)

    def put(self, request, pk):
        data = request.data
        databus_exists = DataBuses.objects.get(pk=pk)
        plant = Plant.objects.get(pk=data["plant_id"])
        datalogger = Datalogger.objects.get(pk=data["datalogger"])

        if databus_exists:
            serializer = DataBusesSerializer(databus_exists, data=data)
            if serializer.is_valid():
                serializer.save(plant=plant, datalogger=datalogger)
                return Response(serializer.data)

    def delete(self, _, pk):
        # TODO: delete Inverters from that BUS
        bus_obj = DataBuses.objects.get(pk=pk)
        bus_obj.delete()
        return Response(None, status.HTTP_200_OK)


class LoginView(ObtainAuthToken):
    def post(self, request):
        """
        Handles POST requests for user login.

        Parameters:
        - request: Django request object

        Returns:
        - Response: JSON response containing authentication token
        """
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        staff = user.is_staff  # Simplified check for staff status
        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "created": created,
                "staff": staff,
            }
        )


class LogoutView(APIView):
    """
    API endpoint that logs the User out.
    """

    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def get(self, request, format=None):
        """
        Handles GET requests for user logout.

        Parameters:
        - request: Django request object
        - format: Format of the response (not used)

        Returns:
        - Response: Placeholder for the response
        """
        # Simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_202_ACCEPTED)


class UserView(APIView):
    def get(self, request, format=None):
        username = request.GET.get("username")

        if not username:
            users = User.objects.all()
        else:
            users = User.objects.filter(username__icontains=username)

        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)
