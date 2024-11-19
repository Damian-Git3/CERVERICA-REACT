import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// CSS
import "./css/main.css";

// Axios Config
import "./config/AxiosConfig.ts";

// PrimeReact
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>
);
