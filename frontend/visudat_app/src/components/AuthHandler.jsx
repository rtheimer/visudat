import { useEffect, useContext } from "react";
import { AuthContext } from "./Context";
import { useNavigate } from "react-router-dom";

const AuthHandler = () => {
  // Retrieve the token from the AuthContext
  const token = useContext(AuthContext)[0];

  // Get the navigate function from React Router
  const navigate = useNavigate();

  // Effect to update local storage when the token changes
  useEffect(() => {
    // Store the token in local storage
    localStorage.setItem("Token", token);

    // Retrieve the token from local storage
    let tokenValue = localStorage.getItem("Token");

    // Check if the token is null or "null"
    if (tokenValue === null || tokenValue === "null") {
      // Navigate to the specified route when the token is not available
      navigate("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Dependency array includes 'token' to trigger the effect when the token changes
};

export default AuthHandler;
