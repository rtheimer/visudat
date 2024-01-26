import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import AdminPanel from "./components/pages/AdminPanel";
import AuthHandler from "./components/AuthHandler";
import { Theme } from "@radix-ui/themes";
import { AuthContext, DarkmodeContext } from "./components/Context";
import React, { useState } from "react";

// Main application component responsible for routing and authentication.

function App() {
  const [darkMode, setDarkMode] = useState("light");

  // Check if a token is stored in local storage
  let token = localStorage.getItem("Token");

  // Set initial token value in local storage if it's not present
  if (token === null) {
    localStorage.setItem("Token", null);
  }

  // State to manage the authentication token
  const [authtoken, setAuthtoken] = useState(token);

  // Render the main application structure
  return (
    <Theme
      grayColor="sand"
      accentColor="indigo"
      style={{ height: "100%" }}
      appearance={darkMode}
    >
      <AuthContext.Provider value={[authtoken, setAuthtoken]}>
        <DarkmodeContext.Provider value={[darkMode, setDarkMode]}>
          {/* Set up the application routing using React Router */}
          <BrowserRouter>
            {/* Component responsible for handling authentication logic */}
            <AuthHandler></AuthHandler>

            {/* Define routes for different pages */}
            <Routes>
              {/* Route for the login page */}
              <Route index element={<LoginPage />} />

              {/* Route for the dashboard page */}
              <Route path="dash" element={<Dashboard />} />

              {/* Route for the adminpanel page */}
              <Route path="admin" element={<AdminPanel />} />
            </Routes>
          </BrowserRouter>
        </DarkmodeContext.Provider>
      </AuthContext.Provider>
    </Theme>
  );
}

export default App;
