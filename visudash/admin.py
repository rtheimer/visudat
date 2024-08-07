from django.contrib import admin
from .models import Owner, PvSystem, Datalogger, DataBus

# Register your models here.
admin.site.register(Owner)
admin.site.register(PvSystem)
admin.site.register(Datalogger)
admin.site.register(DataBus)
