import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Preloader from "./components/Preloader";
import { SessionGuard } from "./Guards/SessionGuard";
import Inicio from "./pages/Inicio";
import MainLayout from "./pages/layout/MainLayout";
import SolicitudesMayoristas from "./pages/SolicitudesMayoristas";
import Notificaciones from "./pages/Notificaciones";
import SolicitudAsistenciaCliente from "./pages/mesa-ayuda/cliente/solicitud-asistencia";

import { Toast } from "primereact/toast";
import React, { useRef } from "react";
import DetalleSolicitudAsistencia from "./pages/mesa-ayuda/cliente/detalle-solicitud";

// Contexto para manejar los mensajes de Toast
export const ToastContext = React.createContext();

const App = () => {
  const toast = useRef(null);

  // Función para mostrar el mensaje de Toast
  const showToast = ({
    severity = "error",
    summary = "Error",
    detail = "No se pudo completar la acción.",
  }) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Preloader />} />

          <Route element={<SessionGuard />}>
            <Route element={<MainLayout />}>
              <Route path="/inicio" element={<Inicio />} />
              <Route
                path="/solicitudes-mayoristas"
                element={<SolicitudesMayoristas />}
              />
              <Route path="/notificaciones" element={<Notificaciones />} />
              <Route
                path="/mesa-ayuda-cliente"
                element={<SolicitudAsistenciaCliente />}
              />
              <Route
                path="/solicitud-asistencia/:solicitudId"
                element={<DetalleSolicitudAsistencia />}
              />
              <Route
                path="/mesa-ayuda-agente"
                element={<SolicitudAsistenciaCliente />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/inicio" />} />
        </Routes>
      </BrowserRouter>
    </ToastContext.Provider>
  );
};

export default App;
