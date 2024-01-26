import React, { useState, useEffect, useContext } from "react";
import { ScrollArea, Flex, Box } from "@radix-ui/themes";
import axios from "axios";
import { AuthContext } from "./Context";
import { apiBaseUrl, apiPort } from "./VisudatConfig";

// This component represents a list of plants fetched from an API.

function MyList({ setContent }) {
  // Access the CSRF token from the AuthContext
  const csrftoken = useContext(AuthContext)[0];

  // Set the Authorization header for Axios requests
  axios.defaults.headers.get["Authorization"] = "Token " + csrftoken;

  // State to manage the list of plants, loading status, and errors
  const [plants, setPlants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch the list of plants from the API
  useEffect(() => {
    axios
      .get(apiBaseUrl + (apiPort !== 80 ? ":" + apiPort : "") + "/api/plants/")
      .then(function (res) {
        console.log(res.data);
        // Transform the API response to a list of plants with selected properties
        const plantList = res.data.map((item) => ({
          id: item.id,
          plant_name: item.plant_name,
        }));
        setPlants(plantList);
        setLoading(false);
      })
      .catch(function (err) {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle the click event for each plant item
  const handleItemClick = (item) => {
    // Set the content based on the selected plant
    setContent([item.plant_name, item.id]);
    // Set the selected item ID for styling
    setSelectedItem(item.id);
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the list of plants with ScrollArea and Box components
  return (
    <ScrollArea type="always" scrollbars="vertical">
      <Box pr="6">
        <ul>
          {/* Map through the list of plants and render each item */}
          {plants.map((item) => (
            <Box
              mb={"2"}
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={
                selectedItem === item.id ? "selectedItem" : "ListBoxItem"
              }
            >
              {item.plant_name}
            </Box>
          ))}
        </ul>
      </Box>
    </ScrollArea>
  );
}

export default MyList;
