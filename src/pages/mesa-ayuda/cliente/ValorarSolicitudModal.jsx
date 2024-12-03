import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import "./ValorarSolicitudModal.css";

const ValorarSolicitudModal = ({ visible, onHide, onSubmit }) => {
  const [mensaje, setMensaje] = useState("");
  const [puntaje, setPuntaje] = useState(0);

  const formValido = puntaje > 0 && mensaje.trim().length > 0;

  const handleConfirmSubmit = () => {
    if (formValido) {
      onSubmit({ mensaje, puntaje });
      onHide();
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <Dialog
      header="Valoración de Asistencia"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
      modal
    >
      <div className="modal-content">
        <div className="field">
          <label>Puntaje</label>
          <Rating value={puntaje} onChange={(e) => setPuntaje(e.value)} stars={10} cancel={false} />
        </div>
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
        <div className="actions">
          <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
          <Button
            label="Confirmar"
            icon="pi pi-check"
            onClick={handleConfirmSubmit}
            disabled={!formValido}
            className="p-button-success"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ValorarSolicitudModal;
