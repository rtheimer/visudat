from .models import Plant, Datalogger, DataBuses
from .pd_data_converter import PowerDog
import pandas as pd


# path to the uploads directory
upload_path = "api/pd_data/powerdog/upload/"


def create_datalogger(
    serial: str = "PD809-00052", plant: str = "Sheddach"
) -> bool:
    """
    creates a Datalogger record
    """
    # get the dataloggers buses config
    handler = PowerDog(upload_path, serial)
    config = handler.filter_conf()

    config = config[0].to_json(orient="records")

    # get the plant obj
    plant_obj = Plant.objects.get(plant_name=plant)

    # create Datalogger obj
    dataset = Datalogger(
        datalogger_serial=serial,
        buses_configured=config,
    )

    dataset.save()

    # add the plant object to the many_to_many field
    dataset.plants.add(plant_obj)

    return True


def create_databus(bus: str, plant: str) -> None:
    """
    creates a Databus record
    """
    # get the corresponding plant
    plant_obj = Plant.objects.get(plant_name=plant)
    # get the corresponding datalogger
    datalogger = Datalogger.objects.get(plants=plant_obj)

    # create Databus obj
    databus = DataBuses(
        data_bus_name=bus, plant=plant_obj, datalogger=datalogger
    )
    databus.save()

def create_inverter(bus: str, plant: str) -> None:
    """
    creates a Inverter record
    """
    # get the corresponding plant
    plant_obj = Plant.objects.get(plant_name=plant)
    # get the corresponding datalogger
    datalogger = Datalogger.objects.get(plants=plant_obj)

    # create Databus obj
    databus = DataBuses(
        data_bus_name=bus, plant=plant_obj, datalogger=datalogger
    )
    databus.save()
