import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import logoNavbar from "../../assets/img/logo-navbar.png";
import { NavLink, useNavigate } from "react-router-dom";
import useSessionStore from "../../stores/useSessionStore";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import useAccount from "../../hooks/useAccount";
import axios from "axios";
import { Button } from "primereact/button";

interface MenuItemPersonalizado extends MenuItem {
  rol?: string[];
}

export default function Navbar() {
  const { session, cerrarSesion: cerrarSesionSessionStore } = useSessionStore();
  const { cerrarSesion } = useAccount();
  const menuRight = useRef<Menu>(null);
  const navigate = useNavigate();

  const items = [
    {
      label: "Perfil",
      icon: "pi pi-user",
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

  const templateItem = (item: any, options: any) => {
    return (
      <NavLink
        to={item.url}
        className={({ isActive }) =>
          isActive ? `${options.className} active` : options.className
        }
      >
        <i className={item.icon}></i>
        <span className="ml-3">{item.label}</span>
      </NavLink>
    );
  };

  const allLinks: MenuItemPersonalizado[] = [
    {
      label: "Gestion",
      icon: "pi pi-arrow-left",
      template: templateItem,
      url: "/gestion/inicio",
      rol: ["Admin", "Agente"],
      command: () => {
        window.location.href = `http://localhost:4200/gestion/inicio`;
      },
    },
    {
      label: "Solicitudes mayoristas",
      icon: "pi pi-user",
      url: "/solicitudes-mayoristas",
      template: templateItem,
      rol: ["Admin", "Agente"],
    },
    {
      label: "Notificaciones",
      icon: "pi pi-bell",
      url: "/notificaciones",
      template: templateItem,
      rol: ["Admin","Agente", "Mayorista", "Cliente", "Operador"],
    },
    {
      label: "Mesa de Ayuda",
      icon: "pi pi-comments",
      url: "/mesa-ayuda-cliente",
      template: templateItem,
      rol: ["Mayorista", "Cliente"],
    },
    {
      label: "Mesa de Ayuda",
      icon: "pi pi-comments",
      url: "/mesa-ayuda-agente",
      template: templateItem,
      rol: ["Agente"],
    },
    {
      label: "Pagos",
      icon: "pi pi-dollar",
      url: "/pagos",
      template: templateItem,
      rol: ["Mayorista"],
    },
  ];

  const links = allLinks.filter((item) => {
    return item.rol?.includes(session!.rol);
  });

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
    <div className="flex align-items-center">
      <Menu
        model={items}
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
    </div>
  );

  return <Menubar model={links} start={start} end={end} />;
}
