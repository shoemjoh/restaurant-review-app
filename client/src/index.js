import React from "react";
import App from "./components/App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { ThemeProvider } from "./components/ThemeContext";

const container = document.getElementById("root");
const root = createRoot(container);

// Wrap App in ThemeProvider and BrowserRouter
root.render(
    <ThemeProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
);
