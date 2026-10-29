import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import DemoBanner from "./demo/DemoBanner";
import { installDemoServer } from "./demo/mockServer";
import { BASE_URL } from "./api";
import "./styles/global.css";

// Browser demo: answer every /api call in the page itself (see demo/mockServer.js).
installDemoServer(BASE_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <DemoBanner />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


