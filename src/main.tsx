import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { DemoApp } from "./app/demo-app.js";
import { createDemoExperience } from "./app/demo-experience.js";
import "./app/styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element for the 体贴 demo");

createRoot(root).render(
  <StrictMode>
    <DemoApp experience={createDemoExperience()} />
  </StrictMode>
);
