import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { MotionRoot } from "./lib/motion.jsx";
import "./styles/base.css";

createRoot(document.getElementById("root")).render(<React.StrictMode><MotionRoot><App /></MotionRoot></React.StrictMode>);
