import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./config/AxiosConfig.ts";
import { PrimeReactProvider } from 'primereact/api';

// PrimeReact

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "./css/main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>
);
