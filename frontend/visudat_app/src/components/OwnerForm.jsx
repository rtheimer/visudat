import { Button, Flex, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./Context";
import ErrorMessage from "./ErrorMessage";
import { apiBaseUrl, apiPort, apiProtocol } from "./VisudatConfig";

// OwnerForm component represents a form for searching and saving owner information.
const OwnerForm = ({ setTableData, formData, setFormData }) => {
  // Retrieve the CSRF token from the AuthContext
  const csrftoken = useContext(AuthContext)[0];

  // Set default headers for axios with the CSRF token
  axios.defaults.headers.common["Authorization"] = "Token " + csrftoken;

  //State to manage form data
  const [data, setData] = useState({
    pk: "",
    company: "",
    name: "",
    firstname: "",
    email: "",
    phone: "",
    mobil: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Update local state when formData changes
    setData({
      pk: formData[0] || "",
      company: formData[1] || "",
      name: formData[2] || "",
      firstname: formData[3] || "",
      email: formData[4] || "",
      phone: formData[5] || "",
      mobil: formData[6] || "",
    });
    setMessage("");
  }, [formData]);

  // Handle changes in form fields
  const handleChange = (e) => {
    const value = e.target.value;

    // Update the corresponding field in the local state
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Make an axios GET request to retrieve owner data based on the provided name
    axios
      .get(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/owners/",
        {
          params: {
            company_name: data.company,
            name: data.name,
            first_name: data.firstname,
            email: data.email,
          },
        }
      )
      .then((response) => {
        // Update the table data with the retrieved owner information
        setTableData(response.data);
        setFormData([""]);
      })
      .catch((error) => {
        setMessage(error.response.data.error);
        // Log any errors that occur during the request
        console.log(error);
      });
  };

  const handlePost = (e) => {
    e.preventDefault();
    console.log("HI", data);
    axios
      .post(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/owners/",
        {
          company_name: data.company,
          full_name: data.name,
          first_name: data.firstname,
          email: data.email,
          phone: data.phone,
          mobil: data.mobil,
        }
      )
      .then((response) => {
        // Log the retrieved owner information
        console.log(response.data);
        setTableData([response.data]);
        setFormData([null, "", "", ""]);
        // Update the table data with the retrieved owner information
        //setTableData(response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.error);
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
          "/owners/"
      )
      .then((reponse) => {
        setFormData([null, "", "", ""]);
        setTableData([]);
      })
      .catch((error) => {
        setMessage(error.response.data.error);
        // Log any errors that occur during the request
        console.log(error);
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
          "/owners/",
        {
          company_name: data.company,
          full_name: data.name,
          first_name: data.firstname,
          email: data.email,
          phone: data.phone,
          mobil: data.mobil,
        }
      )
      .then((response) => {
        setFormData([null, "", "", ""]);
        setTableData([response.data]);
      })
      .catch((error) => {
        setMessage(error.response.data.error);
        // Log any errors that occur during the request
        console.log(error);
      });
  };

  return (
    // Flex container for the owner form
    <Flex height={"100%"} direction={"column"} mt={"5"}>
      {/* Root of the form using Radix UI Form */}
      <ErrorMessage message={message} />
      <Form.Root>
        <Form.Field name="company" onChange={handleChange}>
          <Form.Label>Firma</Form.Label>
          <Form.FormControl asChild>
            {/* Input field for owner name */}
            <TextField.Input
              value={data.company}
              autoComplete="off"
            ></TextField.Input>
          </Form.FormControl>
        </Form.Field>
        {/* Form field for owner name */}
        <Form.Field name="name" onChange={handleChange}>
          <Form.Label>Name (Ansprechpartner)</Form.Label>
          <Form.FormControl asChild>
            {/* Input field for owner name */}
            <TextField.Input
              value={data.name}
              autoComplete="off"
            ></TextField.Input>
          </Form.FormControl>
        </Form.Field>
        {/* Form field for owner Vorname (first name) */}
        <Form.Field name="firstname" onChange={handleChange}>
          <Form.Label>Vorname</Form.Label>
          <Form.FormControl asChild>
            {/* Input field for owner Vorname */}
            <TextField.Input value={data.firstname}></TextField.Input>
          </Form.FormControl>
        </Form.Field>
        {/* Form field for owner email */}
        <Form.Field name="email" onChange={handleChange}>
          <Form.Label>Email</Form.Label>
          <Form.FormControl asChild>
            {/* Input field for owner email */}
            <TextField.Input
              value={data.email}
              autoComplete="off"
            ></TextField.Input>
          </Form.FormControl>
        </Form.Field>
        <Form.Field name="phone" onChange={handleChange}>
          <Form.Label>Telefon</Form.Label>
          <Form.FormControl asChild>
            {/* Input field for owner name */}
            <TextField.Input
              value={data.phone}
              autoComplete="off"
            ></TextField.Input>
          </Form.FormControl>
        </Form.Field>
        <Form.Field name="mobil" onChange={handleChange}>
          <Form.Label>Handy</Form.Label>
          <Form.FormControl asChild>
            {/* Input field for owner name */}
            <TextField.Input
              value={data.mobil}
              autoComplete="off"
            ></TextField.Input>
          </Form.FormControl>
        </Form.Field>
      </Form.Root>
      {/* Flex container for buttons with space between them */}
      <Flex justify={"between"} p={"5"}>
        {/* Button for searching owners */}
        <Button onClick={handleSubmit}>Search</Button>
        {/* Button for clearing the form */}
        <Button onClick={() => setFormData([null, "", "", ""])}>clear</Button>
        <Button onClick={handleDelete}>delete</Button>
        <Button onClick={handlePut}>update</Button>
        {/* Button for saving owner information */}
        <Button onClick={handlePost}>Save</Button>
      </Flex>
    </Flex>
  );
};

export default OwnerForm;
