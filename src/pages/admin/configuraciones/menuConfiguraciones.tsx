import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faBriefcase, faCashRegister } from "@fortawesome/free-solid-svg-icons";
import { IoIosSettings, IoIosBusiness, IoIosCash } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import "./MenuConfiguraciones.css";

const MenuConfiguraciones = () => {
  const navigate = useNavigate();

  const modules = [
    {
      name: "Configuraciones Generales",
      icon: "settings",
      route: "/(admin)/configuraciones/configuracionesGenerales",
    },
    {
      name: "Configuración de Ventas Mayoreo",
      icon: "business",
      route: "/(admin)/configuraciones/configuracionVentasMayoreo",
    },
    {
      name: "Reglas de Puntos",
      icon: "cash",
      route: "/(admin)/puntos/reglaPuntos",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="menu-configuraciones">
      <ToastContainer />
      <div className="header">
        <h1 className="title">Menú de Configuraciones</h1>
      </div>

      <div className="modules-grid">
        {modules.map((module, index) => (
          <div
            key={module.name}
            className="module-card-config"
            onClick={() => handleCardClick(module.route)} // Manejador de clic en la tarjeta
          >
            <div className="module-link">
              {/* Renderizar íconos de FontAwesome o Ionicons según corresponda */}
              {module.icon === "settings" ? (
                <FontAwesomeIcon icon={faCog} size="2x" color="black" />
              ) : module.icon === "business" ? (
                <FontAwesomeIcon icon={faBriefcase} size="2x" color="black" />
              ) : module.icon === "cash" ? (
                <FontAwesomeIcon icon={faCashRegister} size="2x" color="black" />
              ) : (
                <IoIosSettings size={30} color="black" />
              )}
              <p className="module-name">{module.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuAdmin = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/admin/inicio")}>
      <FontAwesomeIcon icon={faCashRegister} size={16} color="black" />
    </button>
  );
};

export default MenuConfiguraciones;
