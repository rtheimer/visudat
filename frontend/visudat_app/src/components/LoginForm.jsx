import {
  Button,
  Card,
  Flex,
  Callout,
  TextField,
  Tabs,
  Box,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Context";
import { apiBaseUrl, apiPort, apiProtocol } from "./VisudatConfig";

// This component represents the login form used for user authentication.

const LoginForm = () => {
  // State to manage form data (username and password)
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  // State to track if the user is an admin
  //const [admin, setAdmin] = useState(false);

  // navigate to adminSite
  const [adminSite, setAdminSite] = useState(false);

  // State to handle errors during form submission
  const [error, setError] = useState(null);

  // Access the navigation function from React Router
  const navigate = useNavigate();

  // Access the setToken function from the AuthContext
  const setToken = useContext(AuthContext)[1];

  // Event handler for input changes in the form fields
  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
    console.log(data.username);
  };

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare user data for authentication API request
    const userData = {
      username: data.username,
      password: data.password,
    };

    // Make API request to authenticate user
    axios
      .post(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/api-token-auth/",
        userData
      )
      .then((response) => {
        // Set the authentication token in the context
        setToken(response.data.token);

        let staff = false;
        // Set the admin State
        if (response.data.staff === true) {
          //setAdmin(true);
          staff = true;
        } else {
          //setAdmin(false);
        }

        // navigate to AdminSite if is admin and adminSite
        // Navigate to the dashboard after successful authentication
        navigate(adminSite && staff ? "/admin/" : setError(true));
        if (!adminSite) {
          navigate("/dash");
          setError(null);
        }
      })
      .catch((error) => {
        // Set the error state
        setError(error);
      });
  };

  // Render the login form UI
  return (
    <Flex
      direction={"column"}
      justify={"center"}
      height={"100%"}
      style={{ alignItems: "center" }}
    >
      {/* Display error messages based on error state and admin status */}
      {error && !adminSite ? (
        <Callout.Root color="ruby">
          <Callout.Text>
            You do not have sufficient privileges to access this application.
          </Callout.Text>
        </Callout.Root>
      ) : error && adminSite ? (
        <Callout.Root color="ruby">
          <Callout.Text>
            You do not have admin privileges to access this application.
          </Callout.Text>
        </Callout.Root>
      ) : null}

      {/* Login form card */}
      <Card
        style={{
          backgroundColor: "var(--accent-a3)",
          width: "360px",
          height: "min-content",
        }}
      >
        {/* Tabs for user and admin login */}
        <Tabs.Root defaultValue="portal" style={{ width: "360px" }}>
          <Tabs.List size="2" style={{ color: "var(--accent-a2)" }}>
            <Tabs.Trigger value="portal" onClick={() => setAdminSite(false)}>
              PV Portal
            </Tabs.Trigger>
            <Tabs.Trigger value="admin" onClick={() => setAdminSite(true)}>
              Admin Portal
            </Tabs.Trigger>
          </Tabs.List>

          <Box>
            {/* Content for the user login tab */}
            <Tabs.Content value="portal">
              <Callout.Root mb={"3"}>
                <Callout.Text size={"6"}>Portal Anmeldung</Callout.Text>
              </Callout.Root>
            </Tabs.Content>

            {/* Content for the admin login tab */}
            <Tabs.Content value="admin">
              <Callout.Root mb={"3"}>
                <Callout.Text size={"6"}>Admin Anmeldung</Callout.Text>
              </Callout.Root>
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        {/* Login form using Radix UI and React Form */}
        <Form.Root className="FormRoot" action="" onSubmit={handleSubmit}>
          {/* Form field for username */}
          <Form.Field
            name="username"
            onChange={handleChange}
            value={data.username}
          >
            {/* Label and error message for username field */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>
                <p style={{ color: "var(--accent-a9)" }}>UserName</p>{" "}
              </Form.Label>
              <Form.Message match="valueMissing">
                <p style={{ color: "var(--accent-a9)" }}>
                  Bitte Username eintragen
                </p>
              </Form.Message>
            </div>
            {/* Input control for the username */}
            <Form.Control asChild>
              <TextField.Input type="text" required />
            </Form.Control>
          </Form.Field>

          {/* Form field for password */}
          <Form.FormField
            name="password"
            style={{ marginTop: "20px" }}
            onChange={handleChange}
            value={data.password}
          >
            {/* Label and error message for password field */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>
                <p style={{ color: "var(--accent-a9)" }}>Passwort</p>{" "}
              </Form.Label>
              <Form.Message match="valueMissing">
                <p style={{ color: "var(--accent-a9)" }}>
                  Bitte Passwort eintragen
                </p>
              </Form.Message>
            </div>
            {/* Input control for the password */}
            <Form.Control asChild>
              <TextField.Input type="password" required />
            </Form.Control>
          </Form.FormField>

          {/* Submit button for the form */}
          <Form.Submit asChild>
            <Button className="Button" style={{ marginTop: 10 }}>
              senden
            </Button>
          </Form.Submit>
        </Form.Root>
      </Card>
    </Flex>
  );
};

export default LoginForm;
