import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSolicitudesAsistencias from "../../../hooks/useSolicitudesAsistencias";
import { ToastContext } from "../../../App";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ListBox } from "primereact/listbox";
import Seguimiento from "./SeguimientoSolicitudModal";
import "../../../css/detalle-solicitud.css";
import "primereact/resources/themes/saga-orange/theme.css";

const DetalleSolicitudAsistenciaAgente = () => {
  const {
    solicitudAsistencia,
    getSolicitudAsistencia,
    cerrarSolicitudAsistencia,
    crearSeguimientoAsistencia,
  } = useSolicitudesAsistencias();

  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const navigate = useNavigate();
  const { solicitudId } = useParams();
  const [modalSeguimientoVisible, setModalSeguimientoVisible] = useState(false);

  const [motivoEliminar, setMotivoEliminar] = useState("");

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

  useEffect(() => {
    getSolicitudAsistencia(Number(solicitudId));
  }, [solicitudId]);

  const handleEliminarSolicitud = () => setModalEliminarVisible(true);
  const handleSeguimientoModal = () => setModalSeguimientoVisible(true);

  const confirmEliminarSolicitud = async () => {
    const res = await cerrarSolicitudAsistencia(
      Number(solicitudId),
      motivoEliminar
    );
    setModalEliminarVisible(false);
    if (res?.status === 200) {
      navigate("/mesa-ayuda-agente");
      showToast({
        severity: "success",
        summary: "Éxito!",
        detail: "Solicitud de asistencia cerrada.",
      });
    } else {
      showToast({
        severity: "error",
        summary: "Error! ❌",
        detail: "No se pudo eliminar la solicitud.",
      });
    }
  };

  const handleSeguimiento = async (data) => {
    const { descripcion, mensaje } = data;
    const formValido =
      descripcion.trim().length > 0 && mensaje.trim().length > 0;
    console.log("Data enviada:", data);
    // Lógica para enviar datos al servidor
    if (formValido) {
      const res = await crearSeguimientoAsistencia({
        IdSolicitudAsistencia: Number(solicitudId),
        Mensaje: mensaje,
        Descripcion: descripcion,
      });
      //const res = { status: 200 }; // Simulación de respuesta
      setModalSeguimientoVisible(false);

      if (res?.status == 200) {
        showToast({
          severity: "success",
          summary: "Éxito! 🎉",
          detail: "Seguimiento añadido.",
        });
        getSolicitudAsistencia(Number(solicitudId));
      } else {
        showToast({
          severity: "error",
          summary: "Error! ❌",
          detail: "No se pudo generar el seguimiento.",
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

  const handleVolver = () => navigate("/mesa-ayuda-agente");

  return (
    <Card className="p-mb-4 bg-card-light">
      <Seguimiento
        visible={modalSeguimientoVisible}
        onHide={() => setModalSeguimientoVisible(false)}
        onSubmit={handleSeguimiento}
      />
      <Button
        icon="pi pi-arrow-left"
        label="Volver"
        className="p-button-text p-mb-3"
        onClick={handleVolver}
      />
      <h2 className="card-title">Detalles de la Solicitud</h2>

      <div className="section">
        <h3 className="section-title">Datos de la Asistencia</h3>
        <Card className="p-mt-2">
          <p>
            <strong>Descripción:</strong>{" "}
            {solicitudAsistencia?.solicitud.descripcion}
          </p>
          <p>
            <strong>Fecha de Solicitud:</strong>{" "}
            {new Date(
              solicitudAsistencia?.solicitud.fechaSolicitud
            ).toLocaleString()}
          </p>
          <p>
            <strong>Estatus:</strong>{" "}
            {solicitudAsistencia?.solicitud.estatus === 3
              ? "Cerrada"
              : "Activa"}
            <br />
            <br />
            {solicitudAsistencia?.solicitud.estatus === 3 ? (
              <>
                <h2>Valoración</h2>
                {solicitudAsistencia?.solicitud.valoracion != null ? (
                  <div>
                    <strong>Valoración:</strong>{" "}
                    {"★".repeat(solicitudAsistencia?.solicitud.valoracion) +
                      "☆".repeat(
                        10 - solicitudAsistencia?.solicitud.valoracion
                      )}
                    <br />
                    <br />
                    <strong>Motivo:</strong>{" "}
                    {solicitudAsistencia?.solicitud.mensajeValoracion}
                  </div>
                ) : (
                  <p>No hay valoración</p>
                )}
              </>
            ) : (
              <></>
            )}
          </p>
        </Card>
      </div>

      <div className="section">
        <h3 className="section-title">Datos del cliente</h3>
        <Card className="p-mt-2">
          <p>
            <strong>Nombre del Cliente:</strong>{" "}
            {solicitudAsistencia?.solicitud.agenteVenta?.fullName}
          </p>
          <p>
            <strong>Email del Cliente:</strong>{" "}
            {solicitudAsistencia?.solicitud.agenteVenta?.email}
          </p>
        </Card>
      </div>

      <div className="section">
        <h3 className="section-title">Datos de la Categoría</h3>
        <Card className="p-mt-2">
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

      <div className="section">
        <h3 className="section-title">Seguimientos</h3>
        <Card className="p-mt-2">
          {solicitudAsistencia?.solicitud.seguimientosSolicitudAsistencia
            .length > 0 ? (
            <ListBox
              value={null}
              options={
                solicitudAsistencia?.solicitud
                  .seguimientosSolicitudAsistencia || []
              }
              itemTemplate={(item) => (
                <>
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
                  <hr />
                </>
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
        <>
          <Button
            label="Registrar seguimiento"
            icon="pi pi-check"
            className="p-button-success p-mt-4"
            onClick={handleSeguimientoModal}
          />
          <br />
          <br />
          <Button
            label="Eliminar Solicitud"
            icon="pi pi-trash"
            className="p-button-danger p-mt-4"
            onClick={handleEliminarSolicitud}
          />
        </>
      )}

      <Dialog
        visible={modalEliminarVisible}
        style={{ width: "50vw" }}
        header="Eliminar Solicitud"
        footer={
          <div className="p-mt-3">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text mr-4"
              onClick={() => setModalEliminarVisible(false)}
            />
            <Button
              label="Eliminar"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => confirmEliminarSolicitud()}
            />
          </div>
        }
        onHide={() => setModalEliminarVisible(false)}
      >
        <div>
          <p>
            ¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no
            se puede deshacer.
          </p>
          <InputText
            placeholder="Motivo de eliminación"
            className="p-mt-2 w-full"
            onChange={(e) => setMotivoEliminar(e.target.value)}
          />
        </div>
      </Dialog>
    </Card>
  );
};

export default DetalleSolicitudAsistenciaAgente;
