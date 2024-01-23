import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { AuthContext } from "./Context";

// This component represents a logout button used for user authentication.

const LogoutButton = () => {
  // Access the CSRF token from the AuthContext
  const csrftoken = useContext(AuthContext)[0];

  // Set the Authorization header for Axios requests
  axios.defaults.headers.get["Authorization"] = "Token " + csrftoken;

  // Access the navigation function from React Router
  const navigate = useNavigate();

  // Access the setToken function from the AuthContext
  const setToken = useContext(AuthContext)[1];

  // Event handler for the logout button click
  const logout = (e) => {
    console.log({ e });
    e.preventDefault();

    // Make API request to log out the user
    axios
      .get("http://192.168.1.107:8000/api-logout/")
      .then(() => {
        // Destroy the authentication token in local storage
        localStorage.removeItem("Token");

        // Set the authentication token to null in the context
        setToken(null);

        // Navigate to the home page after successful logout and
        // replace the current route in the navigation stack
        navigate("/", { replace: true });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        // Navigate to the home page even if already logged out
        navigate("/", { replace: true });
      });
  };

  // Render the logout button
  return (
    <Button variant="surface" onClick={logout}>
      logout
    </Button>
  );
};

export default LogoutButton;
