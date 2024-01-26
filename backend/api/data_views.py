import pandas as pd
import json, re
from django.http import HttpResponse
from .pd_data_converter import PowerDog
from rest_framework import permissions, status, authentication, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Datalogger, DataBuses, Inverter


data_path = "/home/theimer/dev/Visudat/api/pd_data/powerdog/upload/"


# TODO OOP
class BaseData(APIView):
    def __init__(self) -> None:
        self.datalogger = ""
        self.bus = ""
        self.busLastAddress = ""
        self.inverterStings = []
        self.labels = []
        self.data = pd.Series()
        # self.data = pd.DataFrame()

    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


# total data
class TotalData(BaseData):
    """
    API endpoint that returns total Data.
    """

    def __init__(self) -> None:
        super().__init__()

    def get(self, _, pk):
        # Extract parameters from the request
        plant_id = pk

        # Get the corresponding datalogger for the given plant_id
        datalogger = Datalogger.objects.get(plants=plant_id)

        # Get the corresponding BUS name from the buses table
        buses_query = DataBuses.objects.filter(
            datalogger__datalogger_serial=datalogger, plant__id=plant_id
        )
        bus_name = buses_query.values("data_bus_name")[0].get("data_bus_name")

        # Replace "Bus" with "B" in the bus name
        bus_name_transformed = re.sub("Bus", "B", bus_name)

        # Get the BUS LastAddress
        bus_last_address = buses_query.values("bus_last_address")[0].get(
            "bus_last_address"
        )

        # Get the Number of Strings from the Inverters as List
        inverter_query = Inverter.objects.filter(plant_id=plant_id).values(
            "inverter_strings"
        )
        for item in inverter_query:
            self.inverterStings.append(item["inverter_strings"])

        # Initialize a PowerDog data handler
        data_handler = PowerDog(data_path, datalogger)

        try:
            # Loop over bus addresses
            for address in range(int(bus_last_address)):
                column = f"A{str(address + 1)}"

                strings = self.inverterStings[address]
                for string in range(strings):
                    print(string + 1)
                    # Retrieve the data for the specified BUS, column, and string identifier
                    dataframe_year = data_handler.dataframe_year(
                        bus_name_transformed, column, f"S{string+1}"
                    )

                    # build the labels
                    if address == 0:
                        self.labels = dataframe_year["year"].tolist()

                    # Check if self.data is empty before adding DataFrames
                    if self.data.empty:
                        self.data = dataframe_year["produced_year"].div(1000)
                    else:
                        self.data = self.data.add(
                            dataframe_year["produced_year"].div(1000),
                            fill_value=0,
                        )

            # Return the aggregated data as a JSON response
            dataset = self.data.to_list()
            data = json.dumps({"labels": self.labels, "data": dataset})
            return Response(data, content_type="application/json")

        except FileNotFoundError:
            # Handle the case where the file is not found
            return HttpResponse("File not found")


# annual data
class AnnualData(BaseData):
    def __init__(self) -> None:
        super().__init__()
        self.month = {
            1: "jan",
            2: "feb",
            3: "mrz",
            4: "apr",
            5: "may",
            6: "jun",
            7: "jul",
            8: "aug",
            9: "sep",
            10: "oct",
            11: "nov",
            12: "dec",
        }

    def get(self, _, pk, year):
        # Extract parameters from the request
        plant_id = pk
        selected_year = str(year)

        # Get the corresponding datalogger for the given plant_id
        datalogger = Datalogger.objects.get(plants=plant_id)

        # Get the corresponding BUS name from the buses table
        buses_query = DataBuses.objects.filter(
            datalogger__datalogger_serial=datalogger, plant__id=plant_id
        )
        bus_name = buses_query.values("data_bus_name")[0].get("data_bus_name")

        # Replace "Bus" with "B" in the bus name
        bus_name_transformed = re.sub("Bus", "B", bus_name)

        # Get the BUS LastAddress
        bus_last_address = buses_query.values("bus_last_address")[0].get(
            "bus_last_address"
        )
        print(bus_last_address)

        # Get the Number of Strings from the Inverters as List
        inverter_query = Inverter.objects.filter(plant_id=plant_id).values(
            "inverter_strings"
        )
        for item in inverter_query:
            self.inverterStings.append(item["inverter_strings"])

        # Initialize a PowerDog data handler
        data_handler = PowerDog(data_path, datalogger)

        try:
            # Loop over bus addresses
            for address in range(int(bus_last_address)):
                column = f"A{str(address + 1)}"

                strings = self.inverterStings[address]
                for string in range(strings):
                    print(string + 1)
                    try:
                        # Retrieve the data for the specified BUS, column, and string identifier
                        dataframe_month = data_handler.dataframe_month(
                            bus_name_transformed,
                            column,
                            f"S{string+1}",
                            selected_year,
                        )

                        # build the labels
                        if address == 0:
                            data_series = dataframe_month["month"]
                            self.labels = data_series.map(self.month).tolist()

                        # Check if self.data is empty before adding DataFrames
                        if self.data.empty:
                            self.data = dataframe_month["produced_month"].div(
                                1000
                            )
                        else:
                            self.data = self.data.add(
                                dataframe_month["produced_month"].div(1000),
                                fill_value=0,
                            )
                    except:
                        pass

            # Return the aggregated data as a JSON response
            dataset = self.data.to_list()
            data = json.dumps({"labels": self.labels, "data": dataset})
            return Response(data, content_type="application/json")

        except FileNotFoundError:
            # Handle the case where the file is not found
            return HttpResponse("File not found")


# monthly data
class MonthlyData(BaseData):
    def __init__(self) -> None:
        super().__init__()

    def get(self, _, pk, month, year):
        # Extract parameters from the request
        plant_id = pk
        selected_year = str(year)
        selected_month = str(month)

        # Get the corresponding datalogger for the given plant_id
        datalogger = Datalogger.objects.get(plants=plant_id)

        # Get the corresponding BUS name from the buses table
        buses_query = DataBuses.objects.filter(
            datalogger__datalogger_serial=datalogger, plant__id=plant_id
        )
        bus_name = buses_query.values("data_bus_name")[0].get("data_bus_name")

        # Replace "Bus" with "B" in the bus name
        bus_name_transformed = re.sub("Bus", "B", bus_name)

        # Get the BUS LastAddress
        bus_last_address = buses_query.values("bus_last_address")[0].get(
            "bus_last_address"
        )
        print(bus_last_address)

        # Get the Number of Strings from the Inverters as List
        inverter_query = Inverter.objects.filter(plant_id=plant_id).values(
            "inverter_strings"
        )
        for item in inverter_query:
            self.inverterStings.append(item["inverter_strings"])

        # Initialize a PowerDog data handler
        data_handler = PowerDog(data_path, datalogger)

        try:
            # Loop over bus addresses
            for address in range(int(bus_last_address)):
                column = f"A{str(address + 1)}"

                strings = self.inverterStings[address]
                for string in range(strings):
                    print(string + 1)
                    try:
                        # Retrieve the data for the specified BUS, column, and string identifier
                        dataframe_day = data_handler.dataframe_day(
                            bus_name_transformed,
                            column,
                            f"S{string+1}",
                            selected_month,
                            selected_year,
                        )

                        # build the labels
                        if address == 0:
                            data_series = dataframe_day["day"]
                            self.labels = data_series.tolist()

                        # Check if self.data is empty before adding DataFrames
                        if self.data.empty:
                            self.data = dataframe_day["produces_day"].div(
                                1000
                            )
                        else:
                            self.data = self.data.add(
                                dataframe_day["produces_day"].div(1000),
                                fill_value=0,
                            )
                    except:
                        pass

            # Return the aggregated data as a JSON response
            dataset = self.data.to_list()
            data = json.dumps({"labels": self.labels, "data": dataset})
            return Response(data, content_type="application/json")

        except FileNotFoundError:
            # Handle the case where the file is not found
            return HttpResponse("File not found")


# daily data
class DailyData(APIView):
    pass
