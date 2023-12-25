import React from "react";
import ReactDOM from "react-dom/client";
import App from "./ARApp";
import "./index.css";

if (import.meta.env.DEV) {
  import("./connectRemoteDisplay").then(({ connect }) => connect());
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
