import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSolicitudesAsistencias from "../../../hooks/useSolicitudesAsistencias";
import { ToastContext } from "../../../App";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ListBox } from "primereact/listbox";
import "../../../css/detalle-solicitud.css";
import ValorarSolicitudModal from "./ValorarSolicitudModal";
import "primereact/resources/themes/saga-orange/theme.css";

const DetalleSolicitudAsistencia = () => {
  const {
    cambiarAgente,
    cancelarSolicitudAsistencia,
    solicitudAsistencia,
    getSolicitudAsistencia,
    valorarSolicitudAsistencia,
  } = useSolicitudesAsistencias();

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalValorarVisible, setModalValorarVisible] = useState(false);
  const navigate = useNavigate();
  const { solicitudId } = useParams();
  const [modalChangeAgentVisible, setModalChangeAgentVisible] = useState(false);

  const [motivoEliminar, setMotivoEliminar] = useState("");
  const [motivo, setMotivo] = useState("");

  const toast = useContext(ToastContext);

  const showToast = ({
    severity = "error" as
      | "error"
      | "success"
      | "info"
      | "warn"
      | "secondary"
      | "contrast"
      | undefined,
    summary = "Error",
    detail = "No se pudo completar la acción.",
  }) => {
    toast?.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleCambiarAgente = () => {
    setModalChangeAgentVisible(true);
  };

  const handleValorar = async (data) => {
    const { puntaje, mensaje } = data;

    const formValido = puntaje > 0 && mensaje.trim().length > 0;
    console.log("Data enviada:", data);
    // Lógica para enviar datos al servidor
    if (formValido) {
      const res = await valorarSolicitudAsistencia({
        IdSolicitudAsistencia: Number(solicitudId),
        Mensaje: mensaje,
        Valoracion: puntaje,
      });
      //const res = { status: 200 }; // Simulación de respuesta
      setModalVisible(false);

      if (res?.status == 200) {
        showToast({
          severity: "success",
          summary: "Éxito! 🎉",
          detail: "Valoración añadida.",
        });
        handleVolver();
      } else {
        showToast({
          severity: "error",
          summary: "Error! ❌",
          detail: "No se pudo valorar.",
        });
      }
    } else {
      showToast({
        severity: "error",
        summary: "Formulario incompleto!",
        detail: "Por favor, completa todos los campos.",
      });
    }
  };

  const confirmCambiarAgente = async () => {
    const id = solicitudId;
    setModalChangeAgentVisible(false);
    const res = await cambiarAgente({
      IdSolicitudAsistencia: Number(id),
      Mensaje: motivo,
      Valoracion: 0,
    });

    if (res?.status === 200) {
      showToast({
        severity: "success",
        summary: "Éxito!",
        detail: "Cambio de agente exitoso.",
      });
      handleVolver();
    } else {
      showToast({ severity: "error", detail: "No se pudo valorar." });
    }
  };

  useEffect(() => {
    getSolicitudAsistencia(Number(solicitudId));
  }, [solicitudId]);

  const handleEliminarSolicitud = () => setModalVisible(true);

  const confirmEliminarSolicitud = async () => {
    await cancelarSolicitudAsistencia(Number(solicitudId), motivoEliminar);
    setModalVisible(false);
    navigate("/mesa-ayuda-cliente");
    showToast({
      severity: "success",
      summary: "Éxito!",
      detail: "Solicitud de asistencia eliminada.",
    });
  };

  const handleVolver = () => navigate("/mesa-ayuda-cliente");

  return (
    <Card className="p-mb-4 bg-card-light">
      <Button
        icon="pi pi-arrow-left"
        label="Volver"
        className="p-button-text p-mb-3"
        onClick={handleVolver}
      />
      <h2 className="card-title">Detalles de la Solicitud</h2>

      <div className="container-cards">
        <div className="card-solicitud">
          <div className="section">
            <h3 className="section-title">Datos de la Asistencia</h3>
            <Card className="p-mt-2 bg-2">
              <p>
                <strong>Descripción:</strong> {solicitudAsistencia?.solicitud.descripcion}
              </p>
              <p>
                <strong>Fecha de Solicitud:</strong>{" "}
                {new Date(solicitudAsistencia?.solicitud.fechaSolicitud).toLocaleString()}
              </p>
              <p>
                <strong>Estatus:</strong>{" "}
                {solicitudAsistencia?.solicitud.estatus === 3 ? "Cerrada" : "Activa"}
                <br />
                <br />
                {solicitudAsistencia?.solicitud.estatus === 3 ? (
                  <>
                    <h2>Valoración</h2>
                    {solicitudAsistencia?.solicitud.valoracion != null ? (
                      <div>
                        <strong>Valoración:</strong>{" "}
                        {"★".repeat(solicitudAsistencia?.solicitud.valoracion) +
                          "☆".repeat(10 - solicitudAsistencia?.solicitud.valoracion)}
                        <br />
                        <br />
                        <strong>Motivo:</strong> {solicitudAsistencia?.solicitud.mensajeValoracion}
                      </div>
                    ) : (
                      <Button
                        label="Evaluar atención"
                        className="p-button-success p-mt-2"
                        onClick={() => setModalValorarVisible(true)}
                      />
                    )}
                  </>
                ) : (
                  <></>
                )}
              </p>
            </Card>
          </div>
        </div>

        <ValorarSolicitudModal
          visible={modalValorarVisible}
          onHide={() => setModalValorarVisible(false)}
          onSubmit={handleValorar}
        />

        <div className="card-solicitud">
          <div className="section">
            <h3 className="section-title">Datos del Agente</h3>
            <Card className="p-mt-2 bg-1">
              <p>
                <strong>Nombre del Agente:</strong>{" "}
                {solicitudAsistencia?.solicitud.agenteVenta?.fullName}
              </p>
              <p>
                <strong>Email del Agente:</strong>{" "}
                {solicitudAsistencia?.solicitud.agenteVenta?.email}
              </p>
              {solicitudAsistencia?.solicitud.estatus === 3 ? (
                <></>
              ) : (
                <Button
                  label="Cambiar de Agente"
                  className="p-button-warning p-mt-2"
                  onClick={handleCambiarAgente}
                />
              )}
            </Card>
          </div>
        </div>

        <div className="card-solicitud">
          <div className="section">
            <h3 className="section-title">Datos de la Categoría</h3>
            <Card className="p-mt-2 bg-3">
              <p>
                <strong>Nombre de la Categoría:</strong>{" "}
                {solicitudAsistencia?.solicitud.categoriaAsistencia?.nombre}
              </p>
              <p>
                <strong>Estatus:</strong>{" "}
                {solicitudAsistencia?.solicitud.categoriaAsistencia?.estatus
                  ? "Activa"
                  : "Inactiva"}
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Seguimientos</h3>
        <Card className="p-mt-2">
          {solicitudAsistencia?.solicitud.seguimientosSolicitudAsistencia.length > 0 ? (
            <ListBox
              value={null}
              options={solicitudAsistencia?.solicitud.seguimientosSolicitudAsistencia || []}
              itemTemplate={(item) => (
                <div key={item.id}>
                  <p>
                    <strong>Descripción:</strong> {item.descripcion}
                  </p>
                  <p>
                    <strong>Fecha de Seguimiento:</strong>{" "}
                    {new Date(item.fechaSeguimiento).toLocaleString()}
                  </p>
                  <p>
                    <strong>Mensaje:</strong> {item.mensaje}
                  </p>
                </div>
              )}
            />
          ) : (
            <p>No hay seguimientos</p>
          )}
        </Card>
      </div>
      <br />
      <hr />
      <br />

      {solicitudAsistencia?.solicitud.estatus === 3 ? (
        <></>
      ) : (
        <Button
          label="Eliminar Solicitud"
          icon="pi pi-trash"
          className="p-button-danger p-mt-4"
          onClick={handleEliminarSolicitud}
        />
      )}

      <Dialog
        visible={isModalVisible}
        style={{ width: "50vw" }}
        header="Eliminar Solicitud"
        footer={
          <div className="p-mt-3">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text mr-4"
              onClick={() => setModalVisible(false)}
            />
            <Button
              label="Eliminar"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => confirmEliminarSolicitud()}
            />
          </div>
        }
        onHide={() => setModalVisible(false)}
      >
        <div>
          <p>
            ¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.
          </p>
          <InputText
            placeholder="Motivo de eliminación"
            className="p-mt-2 w-full"
            onChange={(e) => setMotivoEliminar(e.target.value)}
          />
        </div>
      </Dialog>

      <Dialog
        visible={modalChangeAgentVisible}
        style={{ width: "50vw" }}
        header="Cambiar Agente"
        footer={
          <div className="p-mt-3">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text mr-4"
              onClick={() => setModalChangeAgentVisible(false)}
            />
            <Button
              label="Cambiar"
              icon="pi pi-check"
              className="p-button-warning"
              onClick={() => confirmCambiarAgente()}
            />
          </div>
        }
        onHide={() => setModalChangeAgentVisible(false)}
      >
        <div>
          <h3>Motivo para cambiar de agente</h3>
          <InputText
            placeholder="Escribe el motivo aquí"
            className="p-mt-2 w-full"
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
      </Dialog>
    </Card>
  );
};

export default DetalleSolicitudAsistencia;
