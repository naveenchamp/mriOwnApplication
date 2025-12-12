// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

import ErrorBoundary from "./components/ErrorBoundary";
import RouterApp from "./RouterApp";

import "./index.css";

console.log("App starting…");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <RouterApp />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);
