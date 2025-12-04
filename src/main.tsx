import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css"; // you can port your existing CSS here

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
