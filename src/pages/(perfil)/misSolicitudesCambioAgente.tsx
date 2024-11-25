import { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify"; // Usamos react-toastify para los mensajes
import "react-toastify/dist/ReactToastify.css"; // Importamos los estilos de react-toastify
import { useLocation, useParams } from "react-router-dom"; // Cambio para la navegación
import useCambioAgente from "./../../hooks/useCambioAgente"; // Mantengo el hook

const MisSolicitudesCambioAgente = () => {

  const { getSolicitudesCliente, solicitudesClienteCambioAgente } = useCambioAgente();

  const location = useLocation(); // Asegúrate de que useLocation esté importado
  const userMayoristaDetails = location.state?.userMayoristaDetails || null;

  const [modalVisible, setModalVisible] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para convertir y formatear la fecha
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
      lineColor: "#009688",
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
          toast.error("No se pudieron cargar las solicitudes.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSolicitudes();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner"></div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (!userMayoristaDetails || !userMayoristaDetails.agenteVenta) {
    toast.error("Detalles del agente no disponibles.");
    return null;
  }

  const renderTimelineItem = (item) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "10px 0",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "10px",
          borderColor:
            item.status === "Aceptado"
              ? "#4CAF50"
              : item.status === "Rechazado"
              ? "#F44336"
              : item.status === "Pendiente"
              ? "#ed9224"
              : "#000",
          borderWidth: "1px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3>{item.title}</h3>
          <p>Agente a cambiar: {item.agenteVenta}</p>
          <p>Motivo del cambio: {item.description}</p>
          <p style={{ fontStyle: "italic" }}>Fecha de solicitud: {item.fechaSolicitud}</p>

          {item.status === "Aceptado" && (
            <>
              <p style={{ color: "#4CAF50" }}>Estado: Aceptada</p>
              <p>Nuevo Agente: {item.nuevoAgente}</p>
              <p>Fecha de respuesta: {item.fechaRespuesta}</p>
            </>
          )}

          {item.status === "Rechazada" && (
            <>
              <p style={{ color: "#F44336" }}>Estado: Rechazada</p>
              <p>Fecha de respuesta: {item.fechaRespuesta}</p>
              <p>Motivo del rechazo: {item?.motivoRechazo}</p>
            </>
          )}

          {item.status === "Pendiente" && (
            <p style={{ color: "#ed9224" }}>Estado: Pendiente</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>Mis Solicitudes de Cambio de Agente de Ventas</h1>
      </div>

      <div>
        {timelineData.map((item, index) => (
          <div key={index}>{renderTimelineItem(item)}</div>
        ))}
      </div>
    </div>
  );
};

export default MisSolicitudesCambioAgente;
