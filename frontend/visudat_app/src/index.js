import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "@radix-ui/themes/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18n";
import { Theme } from "@radix-ui/themes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Apply Radix UI theme with specified accent and gray colors */}
    <Theme style={{ height: "100%" }}>
      <App />
    </Theme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
