import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSolicitudesAsistencias from '../../../hooks/useSolicitudesAsistencias';
import { ToastContext } from "../../../App";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import "../../../css/detalle-solicitud.css";

const DetalleSolicitudAsistencia = () => {
  const {
    cambiarAgente,
    cancelarSolicitudAsistencia,
    solicitudAsistencia,
    getSolicitudAsistencia,
  } = useSolicitudesAsistencias();

  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const { solicitudId } = useParams();
  const [modalChangeAgentVisible, setModalChangeAgentVisible] = useState(false);

  const { showToast } = useContext(ToastContext);

  const handleCambiarAgente = () => {
    setModalChangeAgentVisible(true);
  };

  const confirmCambiarAgente = async (reason) => {
    const id = solicitudId;
    setModalChangeAgentVisible(false);
    const res = await cambiarAgente({
      IdSolicitudAsistencia: Number(id),
      Mensaje: reason,
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

  const confirmEliminarSolicitud = async (descripcion) => {
    await cancelarSolicitudAsistencia(Number(solicitudId), descripcion);
    setModalVisible(false);
    navigate('/solicitud-asistencia');
    showToast({
      severity: "success",
      summary: "Éxito!",
      detail: "Solicitud de asistencia eliminada.",
    });
  };

  const handleVolver = () => navigate('/mesa-ayuda-cliente');

  return (
    <Card className="p-mb-4">
      <Button icon="pi pi-arrow-left" label="Volver" className="p-button-text p-mb-3" onClick={handleVolver} />
      <h2 className="card-title">Detalles de la Solicitud</h2>
      
      <div className="section">
        <h3 className="section-title">Datos de la Asistencia</h3>
        <Card className="p-mt-2">
          <p><strong>Descripción:</strong> {solicitudAsistencia?.solicitud.descripcion}</p>
          <p><strong>Fecha de Solicitud:</strong> {new Date(solicitudAsistencia?.solicitud.fechaSolicitud).toLocaleString()}</p>
          <p><strong>Estatus:</strong> {solicitudAsistencia?.solicitud.estatus === 3 ? "Cerrada" : "Activa"}</p>
        </Card>
      </div>

      <div className="section">
        <h3 className="section-title">Datos del Agente</h3>
        <Card className="p-mt-2">
          <p><strong>Nombre del Agente:</strong> {solicitudAsistencia?.solicitud.agenteVenta?.fullName}</p>
          <p><strong>Email del Agente:</strong> {solicitudAsistencia?.solicitud.agenteVenta?.email}</p>
          <Button label="Cambiar de Agente" className="p-button-warning p-mt-2" onClick={handleCambiarAgente} />
        </Card>
      </div>

      <div className="section">
        <h3 className="section-title">Datos de la Categoría</h3>
        <Card className="p-mt-2">
          <p><strong>Nombre de la Categoría:</strong> {solicitudAsistencia?.solicitud.categoriaAsistencia?.nombre}</p>
          <p><strong>Estatus:</strong> {solicitudAsistencia?.solicitud.categoriaAsistencia?.estatus ? "Activa" : "Inactiva"}</p>
        </Card>
      </div>

      <div className="section">
        <h3 className="section-title">Seguimientos</h3>
        <Card className="p-mt-2">
          <ListBox value={null} options={solicitudAsistencia?.solicitud.seguimientosSolicitudAsistencia || []}
            itemTemplate={(item) => (
              <div key={item.id}>
                <p><strong>Descripción:</strong> {item.descripcion}</p>
                <p><strong>Fecha de Seguimiento:</strong> {new Date(item.fechaSeguimiento).toLocaleString()}</p>
                <p><strong>Mensaje:</strong> {item.mensaje}</p>
              </div>
            )}
          />
        </Card>
      </div>

      <Button label="Eliminar Solicitud" icon="pi pi-trash" className="p-button-danger p-mt-4" onClick={handleEliminarSolicitud} />
      
      <Dialog visible={isModalVisible} style={{ width: '50vw' }} header="Eliminar Solicitud" onHide={() => setModalVisible(false)}>
        <div>
          <p>¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.</p>
          <InputText placeholder="Motivo de eliminación" value={""} onChange={(e) => {}} className="p-mt-2" />
          <div className="p-mt-3">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setModalVisible(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={() => confirmEliminarSolicitud("Motivo")} />
          </div>
        </div>
      </Dialog>

      <Dialog visible={modalChangeAgentVisible} style={{ width: '50vw' }} header="Cambiar Agente" onHide={() => setModalChangeAgentVisible(false)}>
        <div>
          <h3>Motivo para cambiar de agente</h3>
          <InputText placeholder="Escribe el motivo aquí" value={""} onChange={(e) => {}} className="p-mt-2" />
          <div className="p-mt-3">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setModalChangeAgentVisible(false)} />
            <Button label="Cambiar" icon="pi pi-check" className="p-button-warning" onClick={() => confirmCambiarAgente("Motivo")} />
          </div>
        </div>
      </Dialog>
    </Card>
  );
};

export default DetalleSolicitudAsistencia;
