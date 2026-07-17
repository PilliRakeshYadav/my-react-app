import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./responsive.css";
import './styles/fonts.css';

document.documentElement.setAttribute("data-theme", "light");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
