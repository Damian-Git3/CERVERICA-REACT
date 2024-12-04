import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <>
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenedor principal */}
      <div style={{ paddingLeft: "15rem", paddingRight: "15rem" }}>
        <Outlet />
      </div>
    </>
  );
}
