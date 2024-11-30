import React, { useState, useContext, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import useCambioAgente from "../../../hooks/useCambioAgente";
import useSessionStore from "../../../stores/useSessionStore";
import useAccount from "../../../hooks/useAccount";
import { Button } from "primereact/button";
import { Select } from "antd";
import { Card } from "primereact/card";


const MotivoCambioModal = ({ modalVisible, setModalVisible, onSubmit }) => {
  const [motivo, setMotivo] = useState("");

  const isSubmitDisabled = motivo.trim() === "";

  return (
    <Dialog
      visible={modalVisible}
      header="Motivo de rechazo"
      style={{ width: "450px" }}
      onHide={() => setModalVisible(false)}
      footer={
        <div className="flex justify-content-end gap-5">
          <Button
            label="Enviar"
            className="p-button-primary"
            disabled={isSubmitDisabled}
            onClick={() => {
              onSubmit(motivo);
              setModalVisible(false);
            }}
          />
          <Button
            label="Cerrar"
            className="p-button-text"
            onClick={() => setModalVisible(false)}
          />
        </div>
      }
    >
      <InputTextarea
        value={motivo}
        onChange={(e) => {
          const regex = /^[a-zA-ZÀ-ÿ0-9.,\s]*$/; // Permite letras con acentos, números, punto, coma y espacios
          const inputValue = e.target.value;
          if (regex.test(inputValue)) {
            setMotivo(inputValue); // Actualiza el valor solo si cumple con el regex
          }
        }}
        rows={4}
        cols={40}
        placeholder="Escriba el motivo de rechazo de la solicitud aquí"
        className={`w-full ${isSubmitDisabled ? "p-invalid" : ""}`}
      />
      {isSubmitDisabled && <small className="p-error">Este campo es obligatorio.</small>}
    </Dialog>
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
      console.log("asasf")
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

      <Button
        onClick={() => setShowPicker(!showPicker)}
        className="p-button-primary"
      >
        {showPicker ? "Ocultar Selección" : "Seleccionar Agente (Opcional)"}
      </Button>

      <ToastContainer />

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

      <div className="flex justify-content-center gap-5 mt-5">
        <Button onClick={handleAceptar} className="p-button-primary w-2 p-text-center">
          Aceptar
        </Button>
        <Button onClick={handleMotivoRechazo} className="p-button-warning w-2 p-text-center">
          Rechazar
        </Button>
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
