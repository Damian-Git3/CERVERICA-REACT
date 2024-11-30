import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast"; // Componente de notificaciones
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card } from "primereact/card"; // Para las tarjetas
import { Tag } from "primereact/tag"; // Etiquetas de estado
import { useLocation } from "react-router-dom"; // Para la navegación
import useCambioAgente from "../../hooks/useCambioAgente";

const MisSolicitudesCambioAgente = () => {
  const { getSolicitudesCliente, solicitudesClienteCambioAgente } = useCambioAgente();
  const location = useLocation();
  const userMayoristaDetails = location.state?.userMayoristaDetails || null;

  const [timelineData, setTimelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(solicitudesClienteCambioAgente);

  const toast = useRef(null); // Referencia para las notificaciones

  // Función para convertir y formatear fechas
  const convertAndFormatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Fecha inválida:", dateString);
      return "Fecha inválida";
    }
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("es-ES", options);
  };

  useEffect(() => {
    const formattedData = solicitudesClienteCambioAgente.map((solicitud) => ({
      title: "Solicitud de cambio de agente",
      description: solicitud.motivo,
      status: solicitud.estatus,
      fechaSolicitud: solicitud.fechaSolicitud
        ? convertAndFormatDate(solicitud.fechaSolicitud)
        : "Fecha no disponible",
      fechaRespuesta: solicitud.fechaRespuesta
        ? convertAndFormatDate(solicitud.fechaRespuesta)
        : "Fecha no disponible",
      agenteVenta: solicitud.agenteVentaActualNombre,
      nuevoAgente: solicitud.agenteVentaNuevoNombre,
      motivoRechazo: solicitud.motivoRechazo,
    }));
    setTimelineData(formattedData);
  }, [solicitudesClienteCambioAgente]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (userMayoristaDetails) {
        try {
          await getSolicitudesCliente(userMayoristaDetails.idMayorista);
        } catch (error) {
          toast.current.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar las solicitudes." });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSolicitudes();
  }, []);

  const getStatusTag = (status) => {
    console.log(status)
    switch (status) {
      case "Aceptado":
        return <Tag value="Aceptado" severity="success" />;
      case "Rechazada":
        return <Tag value="Rechazado" severity="danger" />;
      default:
        return <Tag value="Pendiente" severity="warning" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (!userMayoristaDetails || !userMayoristaDetails.agenteVenta) {
    toast.current.show({ severity: "error", summary: "Error", detail: "Detalles del agente no disponibles." });
    return null;
  }

  const renderTimelineItem = (item, index) => {
    return (
      <Card
        key={index}
        title={item.title}
        subTitle={<div className="flex align-items-center">{getStatusTag(item.status)}</div>}
        className="mb-4 shadow-2"
        style={{ width: '100%' }} 
      >
        <div className="mb-3">
          <strong>Agente actual:</strong> {item.agenteVenta}
        </div>
        <div className="mb-3">
          <strong>Motivo:</strong> {item.description}
        </div>
        <div className="mb-3">
          <strong>Fecha de solicitud:</strong> {item.fechaSolicitud}
        </div>
        {item.status === "Aceptado" && (
          <>
            <div className="mb-3">
              <strong>Nuevo agente:</strong> {item.nuevoAgente}
            </div>
            <div className="mb-3">
              <strong>Fecha de respuesta:</strong> {item.fechaRespuesta}
            </div>
          </>
        )}
        {item.status === "Rechazada" && (
          <>
            <div className="mb-3">
              <strong>Fecha de respuesta:</strong> {item.fechaRespuesta}
            </div>
            <div>
              <strong>Motivo del rechazo:</strong> {item.motivoRechazo}
            </div>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h1 className="text-center mb-4">Mis Solicitudes de Cambio de Agente</h1>
      <div className="grid">
        {timelineData.map((item, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-4" style={{ width: '100%' }}>
            {renderTimelineItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisSolicitudesCambioAgente;
