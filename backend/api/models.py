from django.db import models

# Owner Table
class Owner(models.Model):
    company_name = models.CharField(max_length=70, blank=True)
    full_name = models.CharField(max_length=70)
    first_name = models.CharField(max_length=70)
    email = models.EmailField()
    phone = models.CharField(max_length=70, blank=True)
    mobil = models.CharField(max_length=70, blank=True)


    def __str__(self) -> str:
        return self.full_name
    
# Plant Table
class Plant(models.Model):
    plant_name = models.CharField(max_length=100)
    plant_location = models.CharField(max_length=70)
    owners = models.ManyToManyField(Owner, related_name="plants")

    def __str__(self) -> str:
        return self.plant_name
    

# Inverter Table
class Inverter(models.Model):
    inverter_bus_address = models.CharField(max_length=5)
    inverter_strings = models.IntegerField()
    inverter_configured = models.JSONField()
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"Inverter {self.inverter_bus_address} - {self.plant.plant_name}"

# Datalogger Table
class Datalogger(models.Model):
    datalogger_serial = models.CharField(max_length=20)
    buses_configured = models.JSONField()
    plants = models.ManyToManyField(Plant, related_name="datalogger")

    def __str__(self) -> str:
        return f"{self.datalogger_serial}"
    
# DataBuses Table
class DataBuses(models.Model):
    data_bus_name = models.CharField(max_length=5)
    bus_last_address = models.IntegerField()
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    datalogger = models.ForeignKey(Datalogger, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.plant.plant_name} {self.data_bus_name}"
