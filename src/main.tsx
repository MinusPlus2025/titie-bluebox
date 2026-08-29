import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./eazo/App.jsx";
import "./eazo/styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element for the 体贴 demo");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
