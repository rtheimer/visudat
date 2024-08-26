from django.contrib.auth.models import User
from django.conf import settings
from django.db import models


# Owner Table
class Owner(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owner"
    )  # Ensure a unique relation to the User
    name = models.CharField(max_length=70)
    street = models.CharField(max_length=70)
    zip = models.IntegerField()
    city = models.CharField(max_length=70)
    phone = models.CharField(max_length=70)

    contact_full_name = models.CharField(max_length=70, blank=True)
    contact_first_name = models.CharField(max_length=70, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=70, blank=True)
    contact_mobil = models.CharField(max_length=70, blank=True)

    def __str__(self) -> str:
        return self.full_name


# PV System Table
class PvSystem(models.Model):
    system_name = models.CharField(max_length=100)
    system_street = models.CharField(max_length=70)
    system_zip = models.IntegerField()
    system_city = models.CharField(max_length=70)

    contact_full_name = models.CharField(max_length=70, blank=True)
    contact_first_name = models.CharField(max_length=70, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=70, blank=True)
    contact_mobil = models.CharField(max_length=70, blank=True)

    owners = models.ManyToManyField(Owner, related_name="plants")

    def __str__(self) -> str:
        return self.system_name


# Inverter Table
class Inverter(models.Model):
    inverter_bus_address = models.CharField(max_length=5)
    inverter_strings = models.IntegerField()
    inverter_configured = models.JSONField()
    system = models.ForeignKey(PvSystem, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"Inverter {self.inverter_bus_address} - {self.system.system_name}"


# Datalogger Table
class Datalogger(models.Model):
    datalogger_serial = models.CharField(max_length=20)
    buses_configured = models.JSONField()
    system = models.ManyToManyField(PvSystem, related_name="datalogger")

    def __str__(self) -> str:
        return f"{self.datalogger_serial}"


# DataBuses Table
class DataBus(models.Model):
    data_bus = models.IntegerField()
    bus_last_address = models.IntegerField()
    plant = models.ForeignKey(PvSystem, on_delete=models.CASCADE)
    datalogger = models.ForeignKey(Datalogger, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.system.system_name} {self.data_bus}"

    class Meta:
        verbose_name_plural = "DataBuses"
