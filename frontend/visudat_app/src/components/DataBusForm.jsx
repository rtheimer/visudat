import { Button, Flex, TextField, RadioGroup, Text } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./Context";
import { apiBaseUrl, apiPort, apiProtocol } from "./VisudatConfig";

const DataBusForm = ({ setTableData, formData, setFormData }) => {
  //const csrftoken = getCookie("csrftoken");
  const csrftoken = useContext(AuthContext)[0];

  axios.defaults.headers.post["Authorization"] = "Token " + csrftoken;
  axios.defaults.headers.get["Authorization"] = "Token " + csrftoken;

  const [pvPlants, setPVPlants] = useState([""]);

  const [pvDataLoggers, setPvDataLoggers] = useState([]);
  const [data, setData] = useState({
    data_bus_name: "",
  });

  useEffect(() => {
    setData({
      pk: formData[0] || "",
      data_bus_name: formData[1] || "",
      plant: formData[3] || "",
      data_logger: formData[5] || "",
    });
  }, [formData]);

  // fetching data on mount
  useEffect(() => {
    axios
      .get(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/plants/",
        {
          params: {
            name: "*",
          },
        }
      )
      .then((response) => {
        const plant = response.data.map((obj) => [
          obj.id,
          obj.plant_name,
          obj.plant_location,
        ]);
        setPVPlants(plant);
      }, []);

    axios
      .get(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/logger/"
      )
      .then((response) => {
        const datalogger = response.data.map((obj) => [
          obj.id,
          obj.datalogger_serial,
          obj.plants,
        ]);

        setPvDataLoggers(datalogger);
      });
  }, []);

  console.log("----->", pvDataLoggers);

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .get(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/databuses/",
        {
          params: {
            data_bus_name: data.data_bus_name,
            plant_id: data.plant,
            datalogger: data.data_logger,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setTableData(response.data);
      });
  };
  const handlePost = () => {
    axios
      .post(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/databuses/",
        {
          id: data.pk,
          data_bus_name: data.data_bus_name,
          plant_id: data.plant,
          datalogger: data.data_logger,
        }
      )
      .then((response) => {
        setTableData([response.data]);
        setFormData([""]);
      });
  };
  const handlePut = (e) => {
    axios.put(
      apiProtocol +
        "//" +
        apiBaseUrl +
        (apiPort !== 80 ? ":" + apiPort : "") +
        "/api/" +
        data.pk +
        "/databuses/",
      {
        data_bus_name: data.data_bus_name,
        plant_id: data.plant,
        datalogger: data.data_logger,
      }
    );
  };
  const handleDelete = (e) => {
    axios
      .delete(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/" +
          data.pk +
          "/databuses/"
      )
      .then((response) => {
        setFormData([""]);
        setTableData([]);
      });
  };

  return (
    <Flex justify={"start"} height={"100%"} direction={"column"} mt={"5"}>
      <Form.Root>
        <Form.Field name="data_bus_name" onChange={handleChange}>
          <Form.Label>Datenbus Name</Form.Label>
          <Form.Control asChild>
            <TextField.Input
              value={data.data_bus_name}
              placeholder="BUS"
            ></TextField.Input>
          </Form.Control>
        </Form.Field>
        <Flex gap={"2"} mt={"2"} pl={"3"} direction={"row"}>
          <Flex grow={"1"} direction={"column"}>
            <Form.FormField>
              <Form.FormLabel>Anlagen</Form.FormLabel>
              <RadioGroup.Root
                value={data.plant}
                onValueChange={(newValue) => {
                  setFormData((prevFormData) => {
                    const updatedFormData = [...prevFormData];
                    updatedFormData[3] = newValue;
                    return updatedFormData;
                  });
                }}
              >
                {pvPlants.map((plant, index) => (
                  <Text as="label" size="2" key={index}>
                    <Flex gap="2">
                      <RadioGroup.Item value={plant[0]} />{" "}
                      {plant[1] + ", " + plant[2]}
                    </Flex>
                  </Text>
                ))}
              </RadioGroup.Root>
            </Form.FormField>
          </Flex>
          <Flex grow={"1"}>
            <Form.FormField>
              <Form.FormLabel>Datenlogger</Form.FormLabel>
              <RadioGroup.Root
                value={data.data_logger}
                onValueChange={(newValue) => {
                  setFormData(() => {
                    const updatedFormData = [...formData];
                    updatedFormData[5] = newValue;
                    return updatedFormData;
                  });
                }}
              >
                {pvDataLoggers.map((logger, index) => (
                  <Text as="label" size="2" key={index}>
                    <Flex gap="2">
                      <RadioGroup.Item value={logger[0]} />{" "}
                      {logger[1] +
                        ", " +
                        logger[2][0].plant_name +
                        " " +
                        logger[2][0].plant_location}
                    </Flex>
                  </Text>
                ))}
              </RadioGroup.Root>
            </Form.FormField>
          </Flex>
        </Flex>
      </Form.Root>
      <Flex justify={"between"} p={"5"}>
        <Button onClick={handleSubmit}>search</Button>
        {/* Button for clearing the form */}
        <Button onClick={() => setFormData([""])}>clear</Button>
        <Button onClick={handleDelete}>delete</Button>
        <Button onClick={handlePut}>update</Button>
        <Button onClick={handlePost}>save</Button>
      </Flex>
    </Flex>
  );
};
export default DataBusForm;
