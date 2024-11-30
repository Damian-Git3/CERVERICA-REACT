import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import "./SeguimientoSolicitudModal.css";

const SeguimientoSolicitudModal = ({ visible, onHide, onSubmit }) => {
  const [mensaje, setMensaje] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const formValido = descripcion.trim().length > 0 && mensaje.trim().length > 0;

  const handleConfirmSubmit = () => {
    if (formValido) {
      onSubmit({ mensaje, descripcion });
      onHide();
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <Dialog
      header="Seguimiento de Asistencia"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
      footer={
        <>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button
            label="Confirmar"
            icon="pi pi-check"
            onClick={handleConfirmSubmit}
            disabled={!formValido}
            className="p-button-success"
          />
        </>
      }
      modal
    >
      <div className="modal-content">
        <div className="field">
          <label>Mensaje</label>
          <InputTextarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={5}
            cols={30}
            placeholder="Describe tu experiencia"
          />
        </div>
        <div className="field">
          <label>Descripción de acciones</label>
          <InputTextarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            cols={30}
            placeholder="Describe las acciones realizadas para dar seguimiento a esta solicitud"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default SeguimientoSolicitudModal;
