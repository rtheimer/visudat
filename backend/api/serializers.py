from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Owner, Plant, Datalogger, DataBuses, Inverter


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["pk", "username", "first_name", "last_name", "email", "is_staff"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = "__all__"


class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = "__all__"
        depth = 1


class DataloggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Datalogger
        fields = ["id", "datalogger_serial","buses_configured", "plants"]
        depth = 1

class DataBusesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataBuses
        fields = "__all__"
        depth = 1

class InverterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inverter
        fields = "__all__"
        depth = 1
