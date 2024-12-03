import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <>
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenedor principal */}
      <div className="p-3">
        <Outlet />
      </div>
    </>
  );
}
