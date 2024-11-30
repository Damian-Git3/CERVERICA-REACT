import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Preloader from "./components/Preloader";
import { SessionGuard } from "./Guards/SessionGuard";
import Inicio from "./pages/Inicio";
import MainLayout from "./pages/layout/MainLayout";
import SolicitudesMayoristas from "./pages/SolicitudesMayoristas";
import SolicitudesCambioAgente from "./pages/admin/cambioAgente/solicitudesCambioAgente";
import MenuConfiguraciones from "./pages/admin/configuraciones/menuConfiguraciones";
import Cupones from "./pages/admin/cupones/cupones";
import ReglaPuntos from "./pages/admin/puntos/reglaPuntos";
import ConfiguracionVentasMayoreo from "./pages/admin/configuraciones/configuracionVentasMayoreo";
import ConfiguracionesGenerales from "./pages/admin/configuraciones/configuracionesGenerales";
import FormularioConfiguracionesGenerales from "./pages/admin/configuraciones/formularioConfiguracionesGenerales";
import FormularioConfiguracionVentasMayoreo from "./pages/admin/configuraciones/formularioConfiguracionVentasMayoreo";
import FormularioReglasPuntos from "./pages/admin/puntos/formularioReglasPuntos";
import FormularioCupones from "./pages/admin/cupones/formularioCupones";
import Profile from "./pages/(perfil)/profile";
import Puntosfidelidad from "./pages/(perfil)/puntosFidelidad";
import MisSolicitudesCambioAgente from "./pages/(perfil)/misSolicitudesCambioAgente";
import Agente from "./pages/(perfil)/agente";
import DetalleSolicitudCambioAgente from "./pages/admin/cambioAgente/detalleSolicitudCambioAgente";

import Notificaciones from "./pages/Notificaciones";
import SolicitudAsistenciaCliente from "./pages/mesa-ayuda/cliente/solicitud-asistencia";

import { Toast } from "primereact/toast";
import React, { useRef } from "react";
import DetalleSolicitudAsistencia from "./pages/mesa-ayuda/cliente/detalle-solicitud";
import Pagos from "./pages/pagos/cliente/pagos";
import PagosMayorista from "./pages/pagos/agente/pagos";
import SolicitudAsistenciaAgente from "./pages/mesa-ayuda/agente/solicitud-asistencia";
import DetalleSolicitudAsistenciaAgente from "./pages/mesa-ayuda/agente/detalle-solicitud";
import MayoristasAsignados from "./pages/mesa-ayuda/agente/mayoristas-asignados";

export const ToastContext = React.createContext<React.RefObject<Toast> | null>(
  null
);

const App = () => {
  const toast = useRef<Toast>(null);

  return (
    <ToastContext.Provider value={toast}>
      <Toast ref={toast} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Preloader />} />

          <Route element={<SessionGuard />}>
            <Route element={<MainLayout />}>
              <Route path="/inicio" element={<Inicio />} />

              <Route path="/(perfil)/profile" element={<Profile />} />
              <Route
                path="/(perfil)/puntosFidelidad"
                element={<Puntosfidelidad />}
              />
              <Route
                path="/(perfil)/misSolicitudesCambioAgente"
                element={<MisSolicitudesCambioAgente />}
              />
              <Route path="/(perfil)/agente" element={<Agente />} />

              <Route
                path="/(admin)/cambioAgente/solicitudesCambioAgente"
                element={<SolicitudesCambioAgente />}
              />
              <Route
                path="/(admin)/cambioAgente/detalleSolicitudCambioAgente"
                element={<DetalleSolicitudCambioAgente />}
              />

              <Route
                path="/(admin)/configuraciones/menuConfiguraciones"
                element={<MenuConfiguraciones />}
              />
              <Route
                path="/(admin)/configuraciones/configuracionesGenerales"
                element={<ConfiguracionesGenerales />}
              />
              <Route
                path="/(admin)/configuraciones/formularioConfiguracionesGenerales"
                element={<FormularioConfiguracionesGenerales />}
              />

              <Route
                path="/(admin)/configuraciones/configuracionVentasMayoreo"
                element={<ConfiguracionVentasMayoreo />}
              />
              <Route
                path="/(admin)/configuraciones/formularioConfiguracionVentasMayoreo"
                element={<FormularioConfiguracionVentasMayoreo />}
              />

              <Route
                path="/(admin)/puntos/reglaPuntos"
                element={<ReglaPuntos />}
              />
              <Route
                path="/(admin)/puntos/formularioReglasPuntos"
                element={<FormularioReglasPuntos />}
              />

              <Route path="/(admin)/cupones/cupones" element={<Cupones />} />
              <Route
                path="/(admin)/cupones/formularioCupones"
                element={<FormularioCupones />}
              />

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
                element={<SolicitudAsistenciaAgente />}
              />
              <Route
                path="/agente/solicitud-asistencia/:solicitudId"
                element={<DetalleSolicitudAsistenciaAgente />}
              />
              <Route
                path="/mayorista/:id/pagos"
                element={<PagosMayorista />}
              />
              <Route
                path="/cliente/pagos"
                element={<Pagos />}
              />
              <Route
                path="/mayoristas-asignados"
                element={<MayoristasAsignados />}
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
