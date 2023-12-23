import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WebsocketProvider } from "./contexts/websocket-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WebsocketProvider value={undefined}>
      <App />
    </WebsocketProvider>
  </React.StrictMode>
);
