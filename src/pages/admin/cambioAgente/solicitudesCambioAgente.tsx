import React, { useEffect, useContext, useState } from "react";
import { images } from "../../../constants";
import { Button, Image } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import useCambioAgente from "../../../hooks/useCambioAgente";
import "./SolicitudesCambioAgente.css"; // Importa el archivo CSS

const SolicitudesCambioAgente = () => {
  const { getSolicitudes, solicitudesCambioAgente, cargando } = useCambioAgente();
  const [noSolicitudes, setNoSolicitudes] = useState(false);
  const navigate = useNavigate(); // Usamos useNavigate de react-router-dom

  // Usamos useEffect para cargar las solicitudes al montar el componente
  useEffect(() => {
    const fetchSolicitudes = async () => {
      await getSolicitudes();
    };

    fetchSolicitudes();
  }, []);

  const handleVerSolicitudes = (solicitud) => {
    if (solicitud) {
      navigate("/(admin)/cambioAgente/detalleSolicitudCambioAgente", { state: { solicitud } });
    } else {
      toast.error("Error al acceder a los detalles: No se pudo acceder a la información del usuario.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Solicitudes de Cambio de Agente</h1>
      {cargando && <p>Cargando solicitudes...</p>}
      {noSolicitudes ? (
        <div className="containerDatos">
          <Image
            src={images.noResult} // Usar la imagen importada
            alt="No se encontraron solicitudes de mayoristas"
            style={{ width: "160px", height: "160px" }}
          />
          <p>No se encontraron solicitudes de cambio de agente</p>
        </div>
      ) : (
        solicitudesCambioAgente.map((solicitud) => (
          <div key={solicitud.id} className="solicitudContainer">
            <p>Solicitante: {solicitud.nombreContacto}</p>
            <p>Agente a cambiar: {solicitud.agenteVentaActualNombre}</p>
            <p>Motivo: {solicitud.motivo}</p>
            <p>Estatus: {solicitud.estatus}</p>

            <Button onClick={() => handleVerSolicitudes(solicitud)} variant="primary">
              Ver Solicitud
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default SolicitudesCambioAgente;
