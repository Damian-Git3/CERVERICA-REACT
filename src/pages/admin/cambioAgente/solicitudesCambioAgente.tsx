import React, { useEffect, useState } from "react";
import { images } from "../../../constants";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import useCambioAgente from "../../../hooks/useCambioAgente";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Image } from "primereact/image";

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
      {noSolicitudes || solicitudesCambioAgente.length === 0 ? (
        <div className="w-50" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
          <img src={images.noResult} className="p-mb-3 w-3" alt="No se encontraron datos" />
          <p className="p-text-center">No se encontraron solicitudes de cambio de agente</p>
        </div>
      ) : (
        solicitudesCambioAgente.map((solicitud) => (
          <Card key={solicitud.id} className="p-mb-3 p-shadow-2 p-p-3 w-100" style={{ width: "100%" }}>
            <p>Solicitante: {solicitud.nombreContacto}</p>
            <p>Agente a cambiar: {solicitud.agenteVentaActualNombre}</p>
            <p>Motivo: {solicitud.motivo}</p>
            <p>Estatus: {solicitud.estatus}</p>

            <Button onClick={() => handleVerSolicitudes(solicitud)} className="p-button-warnign">
              Ver Solicitud
            </Button>
          </Card>
        ))
      )}
    </div>
  );
};

export default SolicitudesCambioAgente;
