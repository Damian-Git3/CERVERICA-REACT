import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Preloader from "./components/Preloader";
import { SessionGuard } from "./Guards/SessionGuard";
import Inicio from "./pages/Inicio";
import MainLayout from "./pages/layout/MainLayout";
import SolicitudesMayoristas from "./pages/SolicitudesMayoristas";
import 'bootstrap/dist/css/bootstrap.min.css';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Preloader />} />

        <Route element={<SessionGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/inicio" element={<Inicio />} />

            <Route
              path="/(admin)/cambioAgente/solicitudesCambioAgente"
              element={<SolicitudesCambioAgente />}
            />

            <Route
              path="/(admin)/configuraciones/menuConfiguraciones"
              element={<MenuConfiguraciones />}
            />
            <Route path="/(admin)/configuraciones/configuracionesGenerales" element={<ConfiguracionesGenerales />} />
            <Route path="/(admin)/configuraciones/formularioConfiguracionesGenerales" element={<FormularioConfiguracionesGenerales />} />

            <Route path="/(admin)/configuraciones/configuracionVentasMayoreo" element={<ConfiguracionVentasMayoreo />} />
            <Route path="/(admin)/configuraciones/formularioConfiguracionVentasMayoreo" element={<FormularioConfiguracionVentasMayoreo />} />
            <Route path="/(admin)/puntos/reglaPuntos" element={<ReglaPuntos />} />
            <Route path="/(admin)/puntos/formularioReglasPuntos" element={<FormularioReglasPuntos />} />

            <Route
              path="/(admin)/cupones/cupones"
              element={<Cupones />}
            />
            <Route
              path="/(admin)/cupones/formularioCupones"
              element={<FormularioCupones />}
            />

            <Route
              path="/solicitudes-mayoristas"
              element={<SolicitudesMayoristas />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/inicio" />} />
      </Routes>
    </BrowserRouter>
  );
}
