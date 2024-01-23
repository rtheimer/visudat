import pandas as pd
from typing import List


class PowerDog:
    def __init__(self, path: str, logger: str):
        self.datalogger = logger
        self.path = path

    def filter_conf(self, conf: str = "powerdog.conf") -> List[pd.DataFrame]:
        """Reads the specified `.conf` file and returns a list containing four
        DataFrames:

        1. `buses_configured`: A DataFrame containing rows where the
        "Parameter" column starts with either "Bus" or "LastAddress".

        2. `ftp`: A DataFrame containing rows where the "Parameter" column
        starts with "Ftp".

        3. `inverters`: A DataFrame containing rows where the "Parameter"
        column starts with "Inverter".

        4. `modulfields`: A DataFrame containing rows where the "Parameter"
        column starts with either "ModulFields" or "Modulfield".

        Args:
            conf (str, optional): The path to the `.conf` file to read.
            Defaults to "powerdog.conf".

        Returns:
            List[pd.DataFrame]: A list of four DataFrames: `buses_configured`,
            `ftp`, `inverters`, and `modulfields`.
        """

        
        columns = ["Parameter", "ParameterValue"]
        try:
            data = pd.read_csv(
                f"{self.path}{self.datalogger}/{conf}",
                sep="=",
                names=columns,
                index_col=False,
            )

        except FileNotFoundError as e:
            raise e
             

        # filter the data DataFrame
        # DataFrame configured buses
        buses_configured = data[
            (data["Parameter"].str.startswith("Bus"))
            | (data["Parameter"].str.startswith("LastAddress"))
        ]

        # DataFrame the ftp server
        ftp = data[data["Parameter"].str.startswith("Ftp")]

        # DataFrame the configured inverters for all buses
        inverters = data[data["Parameter"].str.startswith("Inverter")]

        # DataFrame the modulfields
        modulfields = data[
            data["Parameter"].str.startswith("ModulFields")
            | data["Parameter"].str.startswith("Modulfield")
        ]

        return [buses_configured, ftp, inverters, modulfields]

    def dataframe_year(self, bus, address, string):
        data_years = pd.read_csv(
            f"{self.path}{self.datalogger}/{bus}_{address}_{string}_avg_year.txt",
            sep=";",
        )
        # sort Values by Year and rest the index
        result = data_years.sort_values(by=["year"], ascending=True)
        result = result.reset_index(drop=True)
        return result

    def dataframe_month(
        self, bus: str, address: str, string: str, year: str
    ) -> None:
        data_month = pd.read_csv(
            f"{self.path}{self.datalogger}/{bus}_{address}_{string}_avg_month_{year}.txt",
            sep=";",
        )
        print(data_month)

    def dataframe_day(self, bus, address, string, month, year):
        data_day = pd.read_csv(
            f"{self.path}{self.datalogger}/{bus}_{address}_{string}_avg_day_{month}_{year}.txt",
            sep=";",
        )
        print(data_day)

    def dataframe_global(self, bus, address, string, month, day, year):
        data_global = pd.read_csv(
            f"{self.path}{self.datalogger}/{bus}_{address}_{string}_global_{month}_{day}_{year}.txt",
            sep=";",
        )
        print(data_global)


if __name__ == "__main__":
    x = PowerDog("pd_data/powerdog/upload/", "PD612-00010")
    bus_configured, ftp, wechselrichter, modulfeld = x.filter_conf()
    # year = x.dataframe_year("B8", "A1", "S2")

    # print(modulfeld)
    # x.dataframe_year("B8", "A1", "S2")
    # busle = bus_configured.loc[bus_configured["ParameterValue"]]
    # b=busle.to_json(index=False)
    records = wechselrichter.to_json(orient="records")
    records = wechselrichter["Parameter"].str.startswith("Inverter_B1_A10")
    #print(wechselrichter[records].reset_index(drop=True))
    #bus_configured =bus_configured.set_index('Parameter')
    # value_last_address_b8 = bus_configured.loc['LastAddress_B8', 'ParameterValue']
    print(bus_configured.set_index("Parameter").to_dict()["ParameterValue"]["Bus10"])
