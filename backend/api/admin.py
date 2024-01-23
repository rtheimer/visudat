from django.contrib import admin

# Register your models here.
from . import models

admin.site.register(models.Owner)
admin.site.register(models.Plant)
admin.site.register(models.Inverter)
admin.site.register(models.Datalogger)
admin.site.register(models.DataBuses)

# TODO: disable Inverter, Datalogger, Databuses on production