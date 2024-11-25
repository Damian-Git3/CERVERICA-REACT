import React, { useState, useContext, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from "react-router-dom";
import { ActualizarSolicitudCambioAgenteDTO } from "@/dtos/cambioAgente";
import useCambioAgente from "../../../hooks/useCambioAgente";
import useSessionStore from "../../../stores/useSessionStore";
import useAccount from "../../../hooks/useAccount";
import { Select } from "antd";
import "./detalleSolicitudCambioAgente.css"

const MotivoCambioModal = ({ modalVisible, setModalVisible, onSubmit }) => {
  const [motivo, setMotivo] = useState("");

  const isSubmitDisabled = motivo.trim() === ""; // Verificar si el motivo está vacío

  return (
    modalVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">Motivo de rechazo</h2>
          <textarea
            placeholder="Escriba el motivo de rechazo de la solicitud aquí"
            className="input-modal"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows="4"
          />

          {isSubmitDisabled && (
            <p className="error-text">Este campo es obligatorio.</p>
          )}

          <div className="container-buttons-solicitud-agente">
            <button
              onClick={() => {
                onSubmit(motivo);
                setModalVisible(false);
              }}
              className={`submit-button ${isSubmitDisabled ? "disabled" : ""}`}
              disabled={isSubmitDisabled}
            >
              Rechazar
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

const DetalleSolicitudCambioAgente = () => {
  const { session, cerrarSesion: cerrarSesionSessionStore } = useSessionStore();
  const { cerrarSesion } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const solicitud = location?.state?.solicitud || null; // Usando react-router

  console.log("solicitud")
  console.log(solicitud)

  const { actualizarSolicitudCambioAgente, agentesVentas, getAgentes } =
    useCambioAgente();

  const [selectedAgente, setSelectedAgente] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getAgentes();
    };

    fetchData();
  }, []);

  const handleAceptar = async () => {
    if (selectedAgente === solicitud.idAgenteVentaActual) {
      toast.error("El agente nuevo no puede ser el mismo que el agente actual.");
      return; // Detener ejecución si son iguales
    }

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

    const solicitudActualizada = {
      id: solicitud.id,
      idMayorista: solicitud.idMayorista,
      estatus: "Aceptado",
      idAdministrador: session?.idUsuario,
      idAgenteActual: solicitud.idAgenteVentaActual,
      fechaRespuesta: fechaFormatoAPI,
      idAgenteNuevo: selectedAgente,
      motivoRechazo: null,
    };

    try {
      const updatedSolicitud = await actualizarSolicitudCambioAgente(
        solicitud.id,
        solicitudActualizada
      );

      if (updatedSolicitud) {
        toast.success("La solicitud ha sido aceptada con éxito.");
        navigate(-1); // Para regresar a la página anterior
      }
    } catch (error) {
      toast.error("No se pudo aceptar la solicitud.");
    }
  };

  const handleMotivoRechazo = () => {
    setModalVisible(true); // Mostrar el modal al presionar "Rechazar"
  };

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

  const handleRechazar = async (motivoRechazo) => {
    const fechaSolicitud = new Date();
    const fechaFormatoAPI = fechaSolicitud.toISOString(); // Formatear como cadena ISO

    const solicitudActualizada = {
      id: solicitud.id,
      idMayorista: solicitud.idMayorista,
      estatus: "Rechazada",
      idAdministrador: session?.idUsuario,
      idAgenteActual: solicitud.idAgenteVentaActual,
      fechaRespuesta: fechaFormatoAPI,
      idAgenteNuevo: selectedAgente,
      motivoRechazo: motivoRechazo,
    };

    try {
      const updatedSolicitud = await actualizarSolicitudCambioAgente(
        solicitud.id,
        solicitudActualizada
      );

      if (updatedSolicitud) {
        toast.success("La solicitud ha sido rechazada.");
        navigate(-1);
      }
    } catch (error) {
      toast.error("No se pudo rechazar la solicitud.");
    }
  };

  return (
    <div className="container">
      <h1 className="header">Detalle de Solicitud</h1>
      <p>Solicitante: {solicitud.nombreContacto}</p>
      <p>Agente Actual: {solicitud.agenteVentaActualNombre}</p>
      <p>Motivo: {solicitud.motivo}</p>
      <p>Fecha de la solicitud: {convertAndFormatDate(solicitud.fechaSolicitud)}</p>
      <p>Estatus: {solicitud.estatus}</p>

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="button"
      >
        {showPicker ? "Ocultar Selección" : "Seleccionar Agente (Opcional)"}
      </button>

      {showPicker && (
        <Select
          style={{ marginTop: "10px", width: "300px", height: "50px" }}
          value={selectedAgente || ""}
          onChange={(value) => setSelectedAgente(value)}
          className="picker"
        >
          <Select.Option value="">Seleccionar Agente</Select.Option>
          {agentesVentas.map((agente) => (
            <Select.Option key={agente.id} value={agente.id}>
              {agente.fullName}
            </Select.Option>
          ))}
        </Select>
      )}

      <div className="button-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50px" }}>
        <button onClick={handleAceptar} className="button" style={{ backgroundColor: "green" }}>
          Aceptar
        </button>
        <button onClick={handleMotivoRechazo} className="button" style={{ backgroundColor: "red" }}>
          Rechazar
        </button>
      </div>

      <MotivoCambioModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={handleRechazar}
      />
    </div>
  );
};

export default DetalleSolicitudCambioAgente;
