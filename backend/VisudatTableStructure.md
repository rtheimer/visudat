# Visudat Database Tables

## Owner Table
### A Owner is unique
- owner_id
- name
- first_name
- email

| owner_id | owner_name   | owner_address | ...other attributes |
|----------|--------------|---------------|----------------------|
| 1        | Owner1_Name  | Address1      | ...                  |
| 2        | Owner2_Name  | Address2      | ...                  |


## Plant Table
### A Plant could belong to one or more owners
- plant_id
- plant_name
- plant_location 
- **owners** 

| plant_id | plant_name   | plant_location | owner_id | ...other attributes |
|----------|--------------|-----------------|----------|----------------------|
| 101      | Plant1_Name  | Location1      | 1        | ...                  |
| 102      | Plant2_Name  | Location2      | 2        | ...                  |


## Inverter Table
### An Inverter belongs to one Plant

- inverter_id
- inverter_bus_address
- inverter_strings
- **plant**

| inverter_id | inverter_bus_address | inverter_configured | plant_id | ...other attributes |
|-------------|-----------------|-------------------|----------|----------------------|
| 1001        | B8_A1          | JSON OBJ         | 101      |                   |
| 1002        | B8_A2          | JSON OBJ         | 102      |                  |

InverterConfigured Example JSON Obj
---
[{"Parameter":"Inverter_B8_A1_AddressAddition","ParameterValue":null},{"Parameter":"Inverter_B8_A1_Capacity","ParameterValue":"27560"},{"Parameter":"Inverter_B8_A1_Configured","ParameterValue":"ok"},{"Parameter":"Inverter_B8_A1_IP","ParameterValue":"192.168.1.100"},{"Parameter":"Inverter_B8_A1_Inverter_Power","ParameterValue":"20000"},{"Parameter":"Inverter_B8_A1_Manufactor","ParameterValue":"sma"},{"Parameter":"Inverter_B8_A1_Modulfield","ParameterValue":"1"},{"Parameter":"Inverter_B8_A1_Monitoring","ParameterValue":"on"},{"Parameter":"Inverter_B8_A1_Protokoll","ParameterValue":"sma_intern"},{"Parameter":"Inverter_B8_A1_SerialNo","ParameterValue":"1900749219"},{"Parameter":"Inverter_B8_A1_String_1_Capacity","ParameterValue":"17160"},{"Parameter":"Inverter_B8_A1_String_1_Modulfield","ParameterValue":"1"},{"Parameter":"Inverter_B8_A1_String_2_Capacity","ParameterValue":"10400"},{"Parameter":"Inverter_B8_A1_String_2_Modulfield","ParameterValue":"1"},{"Parameter":"Inverter_B8_A1_Strings","ParameterValue":"2"},{"Parameter":"Inverter_B8_A1_Type","ParameterValue":"STP 20000TL-30"},{"Parameter":"Inverter_B8_A1_TypeNumber","ParameterValue":"9284"},{"Parameter":"Inverter_B8_A1_UnitID","ParameterValue":"3"},{"Parameter":"Inverter_B8_A1_desc","ParameterValue":"WR2"}]


## Datalogger Table
### Technician provides DataLoggerSerial, Plant and Bus
### BusesConfigured as DataFrame from powerdog.config
### A Datalogger monitors one or more Plants
- datalogger_id
- datalogger_serial
- buses_configured
- **plants**

| datalogger_id | datalogger_serial | buses_configured | plants | ...other attributes |
|---------------|-------------------|---------------------|----------|----------------------|
| 2001          | PD809-00051            | JSON Obj          | 101      | ...                  |
| 2002          | PD809-00064           | JSON OBJ          | 102      | ...                  |


BusesConfigured Example JSON Obj
---
[{"Parameter":"Bus1","ParameterValue":"off"},{"Parameter":"Bus10","ParameterValue":"off"},{"Parameter":"Bus2","ParameterValue":"off"},{"Parameter":"Bus8","ParameterValue":"on"},{"Parameter":"Bus8_Configured","ParameterValue":"ok"},{"Parameter":"Bus8_Manufactor_1","ParameterValue":"sma"},{"Parameter":"Bus8_Manufactors","ParameterValue":"1"},{"Parameter":"LastAddress_B8","ParameterValue":"2"}]

## DataBuses Table
### Each Databus monitors one Plant
- data_bus_name
- plant
- datalogger

| data_bus_id | data_bus_name |  plant | datalogger | ...other attributes |
|-------------|---------------|----------|---------------|----------------------|
| 3001        | Bus8      | 101      | 2001          | ...                  |
| 3002        | Bus2     | 102      | 2002          | ...                  |


## Summery
Here's a summary of the tables and their relationships:

- Owner Table: Stores information about the owners of plants, including their name, address, and email address. Each owner has a unique identifier (owner_id).

- Plant Table: Stores information about the plants, including their name, location, and the owner's ID (owner_id). A plant can belong to one or more owners.

- Inverter Table: Stores information about the inverters, including their inverter bus address, plant ID (plant_id), and capacity. Each inverter belongs to one plant.

- Datalogger Table: Stores information about the dataloggers, including their model, location, and plant ID (plant_id). A datalogger can monitor one or more plants.

- DataBuses Table: Stores information about the data buses, including their name, type, plant ID (plant_id), and datalogger ID (datalogger_id). Each data bus monitors one plant.

## The relationships between the tables are as follows:

- An owner can have multiple plants.
- A plant can belong to multiple owners.
- A plant can have multiple inverters.
- An inverter belongs to one plant.
- A datalogger can monitor multiple plants.
- A data bus monitors one plant.
- A datalogger can have multiple data buses.