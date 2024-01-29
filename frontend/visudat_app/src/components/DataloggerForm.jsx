import {
  Button,
  ScrollArea,
  Flex,
  Checkbox,
  TextField,
  Box,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./Context";
import ErrorMessage from "./ErrorMessage";
import { apiBaseUrl, apiPort, apiProtocol } from "./VisudatConfig";

// Both const App = () => and function App() are valid ways
// to declare a functional component in React.

const DataloggerForm = ({ setTableData, formData, setFormData }) => {
  //const csrftoken = getCookie("csrftoken");
  const csrftoken = useContext(AuthContext)[0];

  axios.defaults.headers.post["Authorization"] = "Token " + csrftoken;
  axios.defaults.headers.get["Authorization"] = "Token " + csrftoken;
  // form data
  const [data, setData] = useState({
    pk: "",
    datalogger_serial: "",
  });
  const [pvPlants, setPVPlants] = useState([""]);
  const [selectedPvPlants, setSelectedPvPlants] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Update local state when formData changes
    setData({
      pk: formData[0] || "",
      datalogger_serial: formData[1] || "",
    });
    setSelectedPvPlants(formData[3] || []);
    setMessage("");
  }, [formData]);

  // fetching data on mount
  useEffect(() => {
    setSelectedPvPlants([]);
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
      });
  }, []);

  const handleCheckboxSelect = (event, plant) => {
    if (!selectedPvPlants.includes(plant)) {
      setSelectedPvPlants([...selectedPvPlants, plant]);
    } else {
      setSelectedPvPlants((prevSelected) =>
        prevSelected.filter((plan) => plan !== plant)
      );
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
    console.log(data.datalogger_serial);
  };

  const handlePost = (e) => {
    e.preventDefault();
    axios
      .post(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/logger/",
        {
          datalogger_serial: data.datalogger_serial,
          plants: selectedPvPlants,
        }
      )
      .then((response) => {
        console.log(response);
        setTableData([response.data]);
        setFormData([""]);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.error);
      });
  };

  const handlePut = (e) => {
    axios
      .put(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/" +
          data.pk +
          "/logger/",
        {
          datalogger_serial: data.datalogger_serial,
          plants: selectedPvPlants,
        }
      )
      .then((response) => {
        setTableData([response.data]);
        setFormData([""]);
      });
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
          "/logger/"
      )
      .then((response) => {
        setFormData([""]);
        setTableData([]);
      });
  };

  const handleSubmit = (e) => {
    console.log({ e });
    e.preventDefault();

    axios
      .get(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/logger/",
        {
          params: {
            datalogger_serial: data.datalogger_serial,
            plants: selectedPvPlants.join(","),
          },
        }
      )
      .then((response) => {
        setTableData(response.data);
        console.log(response.status, response.data);
      });
  };

  return (
    <Flex justify={"start"} height={"100%"} direction={"column"} mt={"5"}>
      <ErrorMessage message={message} />
      <Form.Root>
        <Form.Field
          name="datalogger_serial"
          onChange={handleChange}
          value={data.datalogger_serial}
        >
          <Form.Label>Seriennummer</Form.Label>
          <Form.Control asChild>
            <TextField.Input value={data.datalogger_serial}></TextField.Input>
          </Form.Control>
        </Form.Field>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "30vh" }}
        >
          <Form.Field name="plants">
            <Box mt={"5"}></Box>
            <Form.Label>PV Anlagen</Form.Label>
            <Box mt={"5"}></Box>
            {pvPlants.map((plant, index) => (
              <Flex gap={"2"} key={index} mt={"2"} pl={"3"}>
                <Checkbox
                  onCheckedChange={(event) =>
                    handleCheckboxSelect(event, plant[0])
                  }
                  checked={selectedPvPlants.includes(plant[0])}
                />
                {plant[1] + ", " + plant[2]}
              </Flex>
            ))}
          </Form.Field>
        </ScrollArea>
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

export default DataloggerForm;
