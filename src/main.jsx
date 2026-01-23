import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/* ✅ SET DEFAULT THEME */
document.documentElement.setAttribute("data-theme", "light");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
