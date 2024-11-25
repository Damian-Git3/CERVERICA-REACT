import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import logoNavbar from "../../assets/img/logo-navbar.png";
import useSessionStore from "../../stores/useSessionStore";
import useAccount from "../../hooks/useAccount";
import axios from "axios";

interface Module {
  name: string;
  icon: string;
  route: string;
  roles: string[];
}

const modules: Module[] = [
  { name: "Vendedores", icon: "pi pi-users", route: "/(admin)/ventas", roles: ["Admin"] },
  { name: "Clientes Mayoristas", icon: "pi pi-users", route: "/(admin)/ventas", roles: ["Admin"] },
  { name: "Precios", icon: "pi pi-dollar", route: "/(admin)/HistorialPrecios", roles: ["Admin"] },
  { name: "Descuentos", icon: "pi pi-percent", route: "/(admin)/ventas", roles: ["Mayorista"] },
  { name: "Pagos", icon: "pi pi-dollar", route: "/(mayorista)/pagos", roles: ["Mayorista"] },
  { name: "Dashboard", icon: "pi pi-chart-bar", route: "/(admin)/(dashboard)", roles: ["Admin"] },
  { name: "Notificaciones", icon: "pi pi-bell", route: "/(crm)/(notificacion)", roles: ["Admin", "Mayorista", "Agente", "Cliente"] },
  { name: "Ventas", icon: "pi pi-shopping-cart", route: "/(admin)/ventas", roles: ["Admin"] },
  { name: "Solicitud Asistencia Agente", icon: "pi pi-smile", route: "/(crm)/(agente)/solicitud-asistencia", roles: ["Admin", "Agente"] },
  { name: "Solicitud Asistencia Cliente", icon: "pi pi-smile", route: "/(crm)/(cliente)/solicitud-asistencia", roles: ["Cliente", "Mayorista"] },
  { name: "Solicitud Cambio Agente", icon: "pi pi-exchange", route: "/(admin)/cambioAgente/solicitudesCambioAgente", roles: ["Admin"] },
  { name: "Gestión de Configuraciones", icon: "pi pi-cog", route: "/(admin)/configuraciones/menuConfiguraciones", roles: ["Admin"] },
  { name: "Solicitudes mayoristas", icon: "pi pi-exchange", route: "/(agente)/(solicitudes-mayoristas)/lista-solicitudes", roles: ["Agente"] },
  { name: "Cupones", icon: "pi pi-tags", route: "/(admin)/cupones/cupones", roles: ["Admin"] },
  { name: "Mis solicitudes", icon: "pi pi-tags", route: "/(mayorista)/(solicitudes-mayoristas)/lista-solicitudes", roles: ["Mayorista"] },
  { name: "Mayoristas Asignados", icon: "pi pi-users", route: "/(agente)/mayoristas-asignados", roles: ["Agente"] },
];

export default function Navbar() {
  const { session, cerrarSesion: cerrarSesionSessionStore } = useSessionStore();
  const { cerrarSesion } = useAccount();
  const navigate = useNavigate();
  const menuRight = useRef<Menu>(null);

  console.log(session)

  const filteredModules = modules.filter((module) => module.roles.includes(session?.rol || ""));

  const items = filteredModules.map((module) => ({
    label: module.name,
    icon: module.icon,
    command: () => {
      console.log("Redirigiendo a:", module.route);
      navigate(module.route);
    },
  }));

  const userMenuItems = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => {
        navigate("/(perfil)/profile");
      },
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: async () => {
        await cerrarSesion();
        cerrarSesionSessionStore();
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = `http://localhost:4200/cerverica/inicio?cerrarsesion=1`;
      },
    },
  ];

  const start = (
    <img
      alt="logo"
      src={logoNavbar}
      height="45"
      className="mr-2 cursor-pointer"
      onClick={() => navigate("/inicio")}
    />
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <Menu
        model={userMenuItems}
        popup
        ref={menuRight}
        id="popup_menu_right"
        popupAlignment="right"
        className="mt-2"
      />
      <Avatar
        label={session?.nombre.charAt(0)}
        style={{ backgroundColor: "#ed9224", color: "black" }}
        shape="circle"
        onClick={(event) => {
          if (menuRight.current) {
            menuRight.current.toggle(event);
          }
        }}
        aria-controls="popup_menu_right"
        aria-haspopup
      />
      <FaBars size={24} className="mr-2 cursor-pointer" onClick={() => navigate("/menu")} />
    </div>
  );

  return <Menubar model={items} start={start} end={end} />;
}
