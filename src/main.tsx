import App from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./components/common/store/store";
import "./index.css";
import "./styles/fontsRC8";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No element with id 'root' found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
