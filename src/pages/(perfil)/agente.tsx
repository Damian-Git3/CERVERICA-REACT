import { useState, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify"; // Usamos react-toastify para los mensajes
import "react-toastify/dist/ReactToastify.css"; // Importamos los estilos de react-toastify
import { useLocation, useNavigate } from "react-router-dom";
import useCambioAgente from "./../../hooks/useCambioAgente";
import { SolicitudCambioAgenteDTO } from "../../dtos/cambioAgente";

const MotivoCambioModal = ({ modalVisible, setModalVisible, onSubmit }) => {
  const [motivo, setMotivo] = useState("");

  const isSubmitDisabled = motivo.trim() === ""; // Verificar si el motivo está vacío

  return (
    modalVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Motivo de cambio</h2>
          <textarea
            placeholder="Escriba el motivo aquí"
            className="input-modal"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={4}
          />
          {isSubmitDisabled && <p className="error-text">Este campo es obligatorio.</p>}
          <div className="container-buttons-solicitud-agente">
            <button
              onClick={() => {
                onSubmit(motivo);
                setModalVisible(false);
              }}
              className={`submit-button ${isSubmitDisabled ? "disabled" : ""}`}
              disabled={isSubmitDisabled}
            >
              Enviar
            </button>
            <button
              onClick={() => setModalVisible(false)}
              className="close-button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const Agente: React.FC = () => {
  const {
    solicitarCambioAgente,
    getUltimaSolicitud,
    ultimaSolicitudClienteCambioAgente,
    getSolicitudesCliente,
    solicitudesClienteCambioAgente,
  } = useCambioAgente();

  const navigate = useNavigate();
  const location = useLocation(); // Asegúrate de que useLocation esté importado
  const userMayoristaDetails = location.state?.userMayoristaDetails || null;

  const [modalVisible, setModalVisible] = useState(false);

  if (!userMayoristaDetails || !userMayoristaDetails.agenteVenta) {
    toast.error("Detalles del agente no disponibles.");
    return null;
  }

  const { agenteVenta } = userMayoristaDetails;

  const handleSolicitarCambio = () => {
    setModalVisible(true);
  };

  const handleMotivoSubmit = async (motivo) => {
    const fechaSolicitud = new Date();

    // Obtener componentes de la fecha
    const year = fechaSolicitud.getFullYear();
    const month = String(fechaSolicitud.getMonth() + 1).padStart(2, "0"); // Mes comienza en 0
    const day = String(fechaSolicitud.getDate()).padStart(2, "0");
    const hours = String(fechaSolicitud.getHours()).padStart(2, "0");
    const minutes = String(fechaSolicitud.getMinutes()).padStart(2, "0");
    const seconds = String(fechaSolicitud.getSeconds()).padStart(2, "0");
    const milliseconds = String(fechaSolicitud.getMilliseconds()).padStart(
      3,
      "0"
    );

    // Formatear como cadena ISO
    const fechaFormatoAPI = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    const solicitudData: SolicitudCambioAgenteDTO = {
      idAgenteVentaActual: agenteVenta.id,
      motivo: motivo,
      solicitante: 1,
      idMayorista: userMayoristaDetails.idMayorista,
      fechaSolicitud: fechaFormatoAPI,
    };

    const response = await solicitarCambioAgente(solicitudData);
    if (response) {
      toast.success(`Solicitud enviada: Motivo - ${motivo}`);
      await getSolicitudesCliente(userMayoristaDetails.idMayorista);
    } else {
      toast.error("No se pudo enviar la solicitud.");
    }
  };

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (userMayoristaDetails) {
        try {
          await getSolicitudesCliente(userMayoristaDetails.idMayorista);
        } catch (error) {
          toast.error("No se pudieron cargar las solicitudes.");
        }
      }
    };

    fetchSolicitudes();
  }, [userMayoristaDetails]);

  const handleVerSolicitudes = () => {
    if (userMayoristaDetails) {
      navigate("/(perfil)/misSolicitudesCambioAgente", {
        state: { userMayoristaDetails },
      });
    } else {
      toast.error("Detalles de usuario mayorista no disponibles.");
    }
  };

  return (
    <div className="container-agente" style={{ textAlign: "center" }}>
      <div className="profile-header">
        <p className="profile-title">Mi Agente de Ventas</p>
      </div>

      <div className="user-info-container">
        <p className="user-info-label">Nombre:</p>
        <p className="user-info-text">{agenteVenta.fullName}</p>
        <p className="user-info-label">Teléfono:</p>
        <p className="user-info-text">{agenteVenta.phoneNumber}</p>
        <p className="user-info-label">Email:</p>
        <p className="user-info-text">{agenteVenta.email}</p>
      </div>

      <div className="button-container">
        {(solicitudesClienteCambioAgente.length === 0 ||
          solicitudesClienteCambioAgente[solicitudesClienteCambioAgente.length - 1].estatus !== "Pendiente") && (
            <Button onClick={handleSolicitarCambio} className="button" style={{ width: "300px" }}>
              Solicitar cambio de agente
            </Button>
          )}
      </div>

      <div className="button-container" style={{ marginTop: "10px" }}>
        <Button onClick={handleVerSolicitudes} className="button" style={{ width: "300px" }}>
          Mis Solicitudes
        </Button>
      </div>

      <MotivoCambioModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={handleMotivoSubmit}
      />

      <ToastContainer />
    </div>
  );
};

export default Agente;
