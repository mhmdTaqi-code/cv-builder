// src/main.jsx أو src/index.jsx (حسب مشروعك)
import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";
import App from "./App";
import "antd/dist/reset.css";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider>
      <AntApp>
        <HashRouter>
          {" "}
          {/* يوفر سياق modal/message/notification */}
          <App />
        </HashRouter>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
