import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <>
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenedor principal */}
      <div style={{ paddingLeft: "10rem", paddingRight: "10rem", paddingTop: "8rem" }}>
        <Outlet />
      </div>
    </>
  );
}
