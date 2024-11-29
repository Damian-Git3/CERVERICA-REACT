// Profile.js
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBeer, FaTags } from "react-icons/fa";
import { IoIosPricetag } from "react-icons/io";
import "./perfilStyle.css";
import useAccount from "../../hooks/useAccount";
import useSessionStore from "../../stores/useSessionStore";
import axios from "axios";
import usePerfil from "../../hooks/usePerfil";

const Profile = () => {
  const { session, cerrarSesion: cerrarSesionSessionStore } = useSessionStore();
  const { cerrarSesion } = useAccount();
  const { getUserMayoristaDetails, getUserDetails, userMayoristaDetails, userDetails, cargando } = usePerfil();
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  useEffect(() => {
    if (session?.rol === "Mayorista") {
      getUserMayoristaDetails();
    } else {
      getUserDetails();
    }
  }, []);

  const handleLogout = async () => {
    await cerrarSesion();
    cerrarSesionSessionStore();
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = `http://localhost:4200/cerverica/inicio?cerrarsesion=1`;

    toast.success("Esperamos vuelvas pronto! Lamentamos que te tengas que ir :(");
  };

  const handlePuntosFidelidad = () => {
    navigate("/perfil/puntosFidelidad");
  };

  const handleNavigateToAgente = () => {
    if (userMayoristaDetails) {
      navigate("/(perfil)/agente", {
        state: { userMayoristaDetails },
      });
    } else {
      toast.error("No se puede acceder al agente de ventas. Detalles de usuario mayorista no disponibles.");
    }
  };

  const modules = [
    { name: "Mis PistoPoints", icon: <FaBeer size={30} />, route: "/(perfil)/puntosFidelidad" },
    { name: "Mis Cupones", icon: <FaTags size={30} />, route: "/(perfil)/cupones" },
    { name: "Mi Agente", icon: <IoIosPricetag size={30} />, action: handleNavigateToAgente },
  ];

  const filteredModules = session?.rol === "Mayorista"
    ? modules.filter((module) => module.name === "Mi Agente")
    : modules.filter((module) => module.name !== "Mi Agente");

  return (
    <div className="profile-container">
      {userMayoristaDetails ? (
        <>
          <div className="profile-header">
            <h2>Información del perfil</h2>
          </div>

          <div className="user-info-container">
            <p><strong>Nombre completo:</strong> {userMayoristaDetails.fullName}</p>
            <p><strong>Email:</strong> {userMayoristaDetails.email}</p>
            <p><strong>Teléfono:</strong> {userMayoristaDetails.phoneNumber}</p>
            <p><strong>Cargo:</strong> {userMayoristaDetails.cargoContacto}</p>
          </div>

          <div className="profile-header">
            <h2>Mi Empresa</h2>
          </div>

          <div className="user-info-container">
            <p><strong>Empresa:</strong> {userMayoristaDetails.nombreEmpresa}</p>
            <p><strong>Email Empresa:</strong> {userMayoristaDetails.emailEmpresa}</p>
            <p><strong>Teléfono Empresa:</strong> {userMayoristaDetails.telefonoEmpresa}</p>
            <p><strong>RFC Empresa:</strong> {userMayoristaDetails.rfcEmpresa}</p>
          </div>
        </>
      ) : userDetails ? (
        <>
          <div className="profile-header">
            <h2>Información del perfil</h2>
          </div>

          <div className="user-info-container">
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Nombre completo:</strong> {userDetails.fullName}</p>
            <p><strong>Teléfono:</strong> {userDetails.phoneNumber}</p>
          </div>
        </>
      ) : (
        <p>No hay detalles de usuario disponibles</p>
      )}

      <div className="modules-grid-profile">
        {filteredModules.map((module, index) => (
          <div
            style={{ cursor: "pointer" }}
            key={index}
            className="module-card"
            onClick={module.action || (() => navigate(module.route))}
          >
            {module.icon}
            <h3>{module.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
