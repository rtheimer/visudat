import {
  Button,
  Checkbox,
  Flex,
  ScrollArea,
  TextField,
  Box,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./Context";
import ErrorMessage from "./ErrorMessage";
import { apiBaseUrl, apiPort } from "./VisudatConfig";

// Both const App = () => and function App() are valid ways
// to declare a functional component in React.

const PlantForm = ({ setTableData, formData, setFormData }) => {
  console.log(formData);
  //const csrftoken = getCookie("csrftoken");
  const csrftoken = useContext(AuthContext)[0];

  // Set default headers for axios with the CSRF token
  axios.defaults.headers.common["Authorization"] = "Token " + csrftoken;

  // form data
  const [data, setData] = useState({
    plant_name: "",
    plant_location: "",
    plant_owners: "",
  });

  // selected Plantowners
  const [selectedPlantOwners, setSelectedPlantOwners] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Update local state when formData changes
    setData({
      pk: formData[0] || "",
      plant_name: formData[1] || "",
      plant_location: formData[2] || "",
      plant_owners: selectedPlantOwners,
    });
    setSelectedPlantOwners(formData[4] || []);
    setMessage("");
  }, [formData]);

  useEffect(() => {
    // Update local state when formData changes
    setData({
      ...data,
      plant_owners: selectedPlantOwners,
    });
  }, [selectedPlantOwners]);

  // Plantowners of the database
  const [plantOwners, setPlantOwners] = useState([""]);

  // fetching data on mount
  useEffect(() => {
    axios
      .get(
        apiBaseUrl + (apiPort !== 80 ? ":" + apiPort : "") + "/api/owners/",
        {
          params: {
            name: "",
          },
        }
      )
      .then((response) => {
        const owners = response.data.map((obj) => [
          obj.id,
          obj.company_name,
          obj.full_name,
          obj.first_name,
        ]);
        setPlantOwners(owners);
      });
  }, []);

  // Handler
  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setData({
      ...data,
      [e.target.name]: value,
    });
    console.log(data);
  };

  const handleCheckboxSelect = (event, plantowner) => {
    if (!selectedPlantOwners.includes(plantowner)) {
      setSelectedPlantOwners([...selectedPlantOwners, plantowner]);
      // setData({
      //   ...data,
      //   plant_owners: selectedPlantOwners,
      // });
    } else {
      setSelectedPlantOwners((prevSelected) =>
        prevSelected.filter((owner) => owner !== plantowner)
      );
    }

    console.log(selectedPlantOwners);
    // Update your state or perform any other logic here
  };

  const handlePost = (e) => {
    console.log("Hi", data);
    e.preventDefault();
    axios
      .post(
        apiBaseUrl + (apiPort !== 80 ? ":" + apiPort : "") + "/api/plants/",
        {
          plant_name: data.plant_name,
          plant_location: data.plant_location,
          plant_owners: data.plant_owners,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((response) => console.log(response.data));
  };
  const handleDelete = (e) => {
    axios
      .delete(
        apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/" +
          data.pk +
          "/plants/"
      )
      .then((response) => {
        setFormData([""]);
        setTableData([]);
      });
  };
  const handlePut = (e) => {
    axios
      .put(
        apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/" +
          data.pk +
          "/plants/",
        {
          plant_name: data.plant_name,
          plant_location: data.plant_location,
          plant_owners: data.plant_owners,
        }
      )
      .then((response) => {
        setFormData([null, "", "", ""]);
        setTableData([response.data]);
      });
  };

  const handleSubmit = (e) => {
    console.log({ e });
    e.preventDefault();

    axios
      .get(
        apiBaseUrl + (apiPort !== 80 ? ":" + apiPort : "") + "/api/plants/",
        {
          params: {
            plant_name: data.plant_name,
            plant_location: data.plant_location,
            plant_owners: selectedPlantOwners.join(","),
          },
        }
      )
      .then((response) => {
        console.log(response.status, response.data);
        setTableData(response.data);
        setSelectedPlantOwners([]);
        setFormData([""]);
      })
      .catch((error) => {
        setMessage(error.response.data.error);
      });
  };

  return (
    <Flex justify={"start"} height={"100%"} direction={"column"} mt={"5"}>
      <ErrorMessage message={message} />
      <Form.Root>
        <Form.Field
          name="plant_name"
          onChange={handleChange}
          value={data.plant_name}
        >
          <Form.Label>Anlage</Form.Label>
          <Form.Control asChild>
            <TextField.Input value={data.plant_name} />
          </Form.Control>
        </Form.Field>
        <Form.Field name="plant_location" onChange={handleChange}>
          <Form.Label>Ort</Form.Label>
          <Form.Control asChild>
            <TextField.Input value={data.plant_location} />
          </Form.Control>
        </Form.Field>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "30vh" }}
        >
          <Form.Field name="plant_owners">
            <Box mt={"5"}></Box>
            <Form.Label>Eigentümer</Form.Label>
            <Box mt={"5"}></Box>
            {plantOwners.map((plantowner, index) => (
              <Flex gap={"2"} key={index} mt={"2"}>
                <Checkbox
                  name={index}
                  value={plantowner}
                  onCheckedChange={(event) =>
                    handleCheckboxSelect(event, plantowner[0])
                  }
                  checked={selectedPlantOwners.includes(plantowner[0])}
                />
                {(plantowner[1] ? plantowner[1] + ": " : "") +
                  plantowner[2] +
                  ", " +
                  plantowner[3]}
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

export default PlantForm;
