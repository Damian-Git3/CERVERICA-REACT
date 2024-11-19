import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Preloader from "./components/Preloader";
import { SessionGuard } from "./Guards/SessionGuard";
import Inicio from "./pages/Inicio";
import MainLayout from "./pages/layout/MainLayout";
import SolicitudesMayoristas from "./pages/SolicitudesMayoristas";

export default function App() {
  return (
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
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/inicio" />} />
      </Routes>
    </BrowserRouter>
  );
}
