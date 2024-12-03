import { useState, useRef, useContext, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";
import useCambioAgente from "./../../hooks/useCambioAgente";
import { SolicitudCambioAgenteDTO } from "../../dtos/cambioAgente";

const MotivoCambioModal = ({ modalVisible, setModalVisible, onSubmit }) => {
  const [motivo, setMotivo] = useState("");
  const isSubmitDisabled = motivo.trim() === ""; // Verificar si el motivo está vacío

  return (
    <Dialog
      visible={modalVisible}
      header="Motivo de cambio"
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
        placeholder="Escriba el motivo aquí"
        className={`w-full ${isSubmitDisabled ? "p-invalid" : ""}`}
      />
      {isSubmitDisabled && <small className="p-error">Este campo es obligatorio.</small>}
    </Dialog>
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
  const location = useLocation();
  const toast = useRef<Toast>(null);
  const userMayoristaDetails = location.state?.userMayoristaDetails || null;

  const [modalVisible, setModalVisible] = useState(false);

  if (!userMayoristaDetails || !userMayoristaDetails.agenteVenta) {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Detalles del agente no disponibles.",
    });
    return null;
  }

  const { agenteVenta } = userMayoristaDetails;

  const handleSolicitarCambio = () => {
    setModalVisible(true);
  };

  const handleMotivoSubmit = async (motivo) => {
    const fechaSolicitud = new Date().toISOString(); // Formato ISO simplificado

    const solicitudData: SolicitudCambioAgenteDTO = {
      idAgenteVentaActual: agenteVenta.id,
      motivo: motivo,
      solicitante: 1,
      idMayorista: userMayoristaDetails.idMayorista,
      fechaSolicitud,
    };

    const response = await solicitarCambioAgente(solicitudData);
    if (response) {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `Solicitud enviada: Motivo - ${motivo}`,
      });
      await getSolicitudesCliente(userMayoristaDetails.idMayorista);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo enviar la solicitud.",
      });
    }
  };

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (userMayoristaDetails) {
        try {
          await getSolicitudesCliente(userMayoristaDetails.idMayorista);
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudieron cargar las solicitudes.",
          });
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
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Detalles de usuario mayorista no disponibles.",
      });
    }
  };

  return (
    <div className="container-agente" style={{ textAlign: "center" }}>
      <Toast ref={toast} />

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
            <Button
              label="Solicitar cambio de agente"
              className="p-button-primary"
              style={{ width: "300px" }}
              onClick={handleSolicitarCambio}
            />
          )}
      </div>

      <div className="button-container" style={{ marginTop: "10px" }}>
        <Button
          label="Mis Solicitudes"
          className="p-button-secondary"
          style={{ width: "300px" }}
          onClick={handleVerSolicitudes}
        />
      </div>

      <MotivoCambioModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={handleMotivoSubmit}
      />
    </div>
  );
};

export default Agente;
