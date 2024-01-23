import { Table, ScrollArea } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";

const DataTable = ({ table_header, data, headLine, setFormData }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  let resultArrays = [];
  switch (headLine) {
    case "Eigentümer Liste":
      console.log(data);
      // Extract values for each object with the specified order
      const ownerArrays = data.map((obj) => [
        obj.id,
        obj.company_name,
        obj.full_name,
        obj.first_name,
        obj.email,
        obj.phone,
        obj.mobil,
      ]);
      resultArrays = ownerArrays;
      break;

    case "PV Anlagen Liste":
      const plantArrays = data.map((obj) => [
        obj.id,
        obj.plant_name,
        obj.plant_location,
        obj.owners.map((owner, index) => (
          <React.Fragment key={index}>
            {(owner.company_name ? owner.company_name + ": " : "") +
              owner.full_name +
              ", "}
            {/*
          If owner.first_name exists, it adds a comma, a space, and the first_name.
          If owner.first_name is falsy (undefined, null, empty string), it skips the comma and space
        */}
            {owner.first_name && `${owner.first_name}`}
            <br />
          </React.Fragment>
        )),
        obj.owners.map((owner) => owner.id),
      ]);

      resultArrays = plantArrays;
      console.log(resultArrays);
      break;

    case "Datenlogger Liste":
      const loggerArrays = data.map((obj) => [
        obj.id,
        obj.datalogger_serial,
        obj.plants.map((plant, index) => (
          <React.Fragment key={index}>
            {plant.plant_name}
            <br />
          </React.Fragment>
        )),
        obj.plants.map((plant) => plant.id),
      ]);
      resultArrays = loggerArrays;

      break;

    case "Benutzer Liste":
      // Extract values for each object with the specified order

      const userArrays = data.map((obj) => [
        obj.pk,
        obj.username,
        obj.first_name,
        obj.last_name,
        obj.email,
        obj.is_staff ? "Admin" : "Anwender",
      ]);
      resultArrays = userArrays;
      break;

    case "Daten Bus Liste":
      const busesArrays = data.map((obj) => [
        obj.id,
        obj.data_bus_name,
        obj.bus_last_address,
        obj.plant.plant_name,
        obj.plant.id,
        obj.datalogger.datalogger_serial,
        obj.datalogger.id,
      ]);
      resultArrays = busesArrays;
      break;

    default:
      break;
  }

  useEffect(() => {
    // Reset selectedRow when the component mounts or when the "Datenlogger Liste" case is encountered
    setSelectedRow(null);
    //setFormData([""]);
  }, [headLine]);

  const handleRowClick = (rowData, rowIndex) => {
    setSelectedRow(rowIndex);

    switch (headLine) {
      case "PV Anlagen Liste":
        const getownersArray = rowData[3].map((o) => [
          o.props.children[0],
          o.props.children[1],
        ]);
        console.log(rowData);
        setFormData([
          rowData[0],
          rowData[1],
          rowData[2],
          getownersArray,
          rowData[4],
        ]);
        break;
      default:
        setFormData(rowData);
        console.log(rowData);
        break;
    }

    //setFormData(["12", "Garage", "Schaible", "Schaible"]);
    // Handle the click event and access rowData (an array containing cell data)
    //console.log("Clicked Row Data:", rowData[3][0].props.children[0]);
    // Add your logic to further process the clicked data
  };

  return (
    <ScrollArea type="auto" scrollbars="vertical" style={{ height: "90%" }}>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {table_header.map((element, index) => {
              return (
                <Table.ColumnHeaderCell key={index}>
                  {element}
                </Table.ColumnHeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {resultArrays.map((el, rowIndex) => {
            return (
              <Table.Row
                key={rowIndex}
                onClick={() => handleRowClick(el, rowIndex)}
                className={
                  selectedRow === rowIndex ? "selectedRow" : "TableRow"
                }
              >
                {el.map((item, cellIndex) => {
                  return (
                    <Table.Cell key={cellIndex}>
                      {item && typeof item === "object" && item.props
                        ? item.props.children
                        : item}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  );
};

export default DataTable;
