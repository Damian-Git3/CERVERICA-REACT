import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import logoNavbar from "../../assets/img/logo-navbar.png";
import useSessionStore from "../../stores/useSessionStore";
import useAccount from "../../hooks/useAccount";
import axios from "axios";
import { MenuItem } from "primereact/menuitem";

interface Module {
  name: string;
  icon: string;
  route: string;
  roles: string[];
}

const modules: Module[] = [
  {
    name: "Vendedores",
    icon: "pi pi-users",
    route: "/(admin)/ventas",
    roles: ["Admin"],
  },
  {
    name: "Clientes Mayoristas",
    icon: "pi pi-users",
    route: "/(admin)/ventas",
    roles: ["Admin"],
  },
  {
    name: "Precios",
    icon: "pi pi-dollar",
    route: "/historial-precios",
    roles: ["Admin"],
  },
  {
    name: "Descuentos",
    icon: "pi pi-percent",
    route: "/(admin)/ventas",
    roles: ["Mayorista"],
  },
  {
    name: "Dashboard",
    icon: "pi pi-chart-bar",
    route: "/(admin)/dashboard",
    roles: ["Admin"],
  },
  {
    name: "Notificaciones",
    icon: "pi pi-bell",
    route: "/notificaciones",
    roles: ["Admin", "Operador", "Cliente", "Mayorista", "Agente"],
  },
  {
    name: "Ventas",
    icon: "pi pi-shopping-cart",
    route: "/(admin)/ventas",
    roles: ["Admin"],
  },
  {
    name: "Solicitud Cambio Agente",
    icon: "pi pi-exchange",
    route: "/(admin)/cambioAgente/solicitudesCambioAgente",
    roles: ["Admin"],
  },
  {
    name: "Gestión de Configuraciones",
    icon: "pi pi-cog",
    route: "/(admin)/configuraciones/menuConfiguraciones",
    roles: ["Admin"],
  },
  {
    name: "Solicitudes mayoristas",
    icon: "pi pi-address-book",
    route: "/solicitudes-mayoristas",
    roles: ["Agente"],
  },
  {
    name: "Cupones",
    icon: "pi pi-tags",
    route: "/(admin)/cupones/cupones",
    roles: ["Admin"],
  },
  {
    name: "Mis solicitudes",
    icon: "pi pi-tags",
    route: "/(mayorista)/(solicitudes-mayoristas)/lista-solicitudes",
    roles: ["Mayorista"],
  },
  {
    name: "Mayoristas Asignados",
    icon: "pi pi-users",
    route: "/mayoristas-asignados",
    roles: ["Agente"],
  },
  {
    name: "Mesa de Ayuda",
    icon: "pi pi-comments",
    route: "/mesa-ayuda-cliente",
    roles: ["Mayorista", "Cliente"],
  },
  {
    name: "Mesa de Ayuda",
    icon: "pi pi-comments",
    route: "/mesa-ayuda-agente",
    roles: ["Agente"],
  },
  {
    name: "Pagos",
    icon: "pi pi-dollar",
    route: "/cliente/pagos",
    roles: ["Mayorista"],
  },
];

export default function Navbar() {
  const { session, cerrarSesion: cerrarSesionSessionStore } = useSessionStore();
  const { cerrarSesion } = useAccount();
  const navigate = useNavigate();
  const menuRight = useRef<Menu>(null);
  const location = useLocation();

  const filteredModules = modules.filter((module) =>
    module.roles.includes(session?.rol || "")
  );

  const items: MenuItem[] = filteredModules.map((module) => ({
    label: module.name,
    icon: module.icon,
    command: () => {
      navigate(module.route);
    },
    className: location.pathname === module.route ? "active" : "",
  }));

  const userMenuItems = [
    {
      label: "ERP",
      icon: "pi pi-arrow-left",
      roles: ["Admin", "Agente", "Operador"],
      command: () => {
        window.location.href = `http://localhost:4200/gestion/inicio`;
      },
    },
    {
      label: "ERP",
      icon: "pi pi-arrow-left",
      roles: ["Cliente", "Mayorista"],
      command: () => {
        window.location.href = `http://localhost:4200`;
      },
    },
    {
      label: "Perfil",
      icon: "pi pi-user",
      roles: ["Admin", "Operador", "Cliente", "Mayorista", "Agente"],
      command: () => {
        navigate("/(perfil)/profile");
      },
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      roles: ["Admin", "Operador", "Cliente", "Mayorista", "Agente"],
      command: async () => {
        await cerrarSesion();
        cerrarSesionSessionStore();
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = `http://localhost:4200/cerverica/inicio?cerrarsesion=1`;
      },
    },
  ];

  const filteredUserMenuItems = userMenuItems.filter((items) =>
    items.roles.includes(session?.rol || "")
  );

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
        model={filteredUserMenuItems}
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

      {/* <i
        className="pi pi-bars mr-2 cursor-pointer"
        onClick={() => navigate("/menu")}
      ></i> */}
    </div>
  );

  return <Menubar model={items} start={start} end={end} />;
}
