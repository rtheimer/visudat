import { Button, Flex, RadioGroup, TextField, Text } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./Context";
import { apiBaseUrl, apiPort } from "./VisudatConfig";

// Both const App = () => and function App() are valid ways
// to declare a functional component in React.

const UserForm = ({ setTableData, formData, setFormData }) => {
  //const csrftoken = getCookie("csrftoken");
  const csrftoken = useContext(AuthContext)[0];

  axios.defaults.headers.post["Authorization"] = "Token " + csrftoken;
  axios.defaults.headers.post["Authorization"] = "Token " + csrftoken;
  // form data
  const [data, setData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    permission: "",
  });

  console.log(formData[5]);

  useEffect(() => {
    // Update local state when formData changes
    setData({
      username: formData[1] || "",
      first_name: formData[2] || "",
      last_name: formData[3] || "",
      email: formData[4] || "",
      permission:
        formData[5] === "Admin" ? "2" : formData[5] === "Anwender" ? "1" : "1",

      // Set a default value (-1 or any other value) if formData[5]
      // doesn't match "Admin" or "Anwender"
    });
  }, [formData]);

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
    console.log(data.username);
  };

  const handleSubmit = (e) => {
    console.log({ e });
    e.preventDefault();

    axios
      .get(apiBaseUrl + (apiPort !== 80 ? ":" + apiPort : "") + "/api/users/", {
        params: {
          username: data.username,
        },
      })
      .then((response) => {
        setTableData(response.data);
        console.log(response.status, response.data);
        //navigate("/dash"); // Navigate after successful API request
      });
  };

  return (
    <Flex justify={"start"} height={"100%"} direction={"column"} mt={"5"}>
      <Form.Root>
        <Form.Field name="username" onChange={handleChange}>
          <Form.Label>Benutzer Name</Form.Label>
          <Form.Control asChild>
            <TextField.Input value={data.username}></TextField.Input>
          </Form.Control>
        </Form.Field>
        <Form.Field name="last_name" onChange={handleChange}>
          <Form.Label>Vorname</Form.Label>
          <Form.Control asChild>
            <TextField.Input value={data.first_name}></TextField.Input>
          </Form.Control>
        </Form.Field>
        <Form.Field name="first_name" onChange={handleChange}>
          <Form.Label>Nachname</Form.Label>
          <Form.Control asChild>
            <TextField.Input value={data.last_name}></TextField.Input>
          </Form.Control>
        </Form.Field>
        <Form.Field name="email" onChange={handleChange}>
          <Form.Label>Email</Form.Label>
          <Form.Control asChild>
            <TextField.Input value={data.email}></TextField.Input>
          </Form.Control>
        </Form.Field>
        <Form.Field name="permissions" onChange={handleChange}>
          <Form.Label>Rechte</Form.Label>
          <Text as="label" size="2">
            <Flex gap="2">
              <RadioGroup.Root value={data.permission}>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Anwender Rechte
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Admin Rechte
                  </Flex>
                </Text>
              </RadioGroup.Root>
            </Flex>
          </Text>
        </Form.Field>
      </Form.Root>
      <Flex justify={"between"} p={"5"}>
        <Button onClick={handleSubmit}>search</Button>
        {/* Button for clearing the form */}
        <Button onClick={() => setFormData([""])}>clear</Button>
        <Button>save</Button>
      </Flex>
    </Flex>
  );
};

export default UserForm;
