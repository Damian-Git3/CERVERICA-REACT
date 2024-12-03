import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import usePuntosFidelidad from "../../../hooks/usePuntosFidelidad";
import { ReglasPuntosDto } from "../../../dtos/puntosFidelidad";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const FormularioReglasPuntos: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reglasPuntos = location.state?.reglasPuntos || null;

  const { registrarReglasPuntos, actualizarReglasPuntos } = usePuntosFidelidad();

  const [formValues, setFormValues] = useState<ReglasPuntosDto>({
    valorMXNPunto: reglasPuntos?.valorMXNPunto || 0,
    montoMinimo: reglasPuntos?.montoMinimo || 0,
    porcentajeConversion: reglasPuntos?.porcentajeConversion || 0,
    fechaModificacion: "",
  });

  const [id, setId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string>("");

  const toastRef = React.useRef<any>(null); // Para mostrar el Toast de PrimeReact

  useEffect(() => {
    if (reglasPuntos) {
      setFormValues({
        valorMXNPunto: reglasPuntos.valorMXNPunto,
        montoMinimo: reglasPuntos.montoMinimo,
        porcentajeConversion: reglasPuntos.porcentajeConversion,
        fechaModificacion: reglasPuntos.fechaModificacion || "",
      });
      setId(reglasPuntos.id);
    }
  }, [reglasPuntos]);

  const handleChange = (name: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value === "" ? 0 : parseFloat(value),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      !/[\d.]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    let formErrors: { [key: string]: string } = {};
    if (formValues.valorMXNPunto <= 0) formErrors.valorMXNPunto = "Valor MXN por Punto debe ser mayor a 0";
    if (formValues.montoMinimo <= 0) formErrors.montoMinimo = "Monto Mínimo debe ser mayor a 0";
    if (formValues.porcentajeConversion <= 0 || formValues.porcentajeConversion > 100)
      formErrors.porcentajeConversion = "Porcentaje de Conversión debe ser entre 0 y 100";

    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      toast.error("Por favor corrige los errores antes de continuar.");
      return;
    }

    const fechaSolicitud = new Date();
    const year = fechaSolicitud.getFullYear();
    const month = String(fechaSolicitud.getMonth() + 1).padStart(2, "0");
    const day = String(fechaSolicitud.getDate()).padStart(2, "0");
    const hours = String(fechaSolicitud.getHours()).padStart(2, "0");
    const minutes = String(fechaSolicitud.getMinutes()).padStart(2, "0");
    const seconds = String(fechaSolicitud.getSeconds()).padStart(2, "0");
    const milliseconds = String(fechaSolicitud.getMilliseconds()).padStart(3, "0");

    const fechaFormatoAPI = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    const dataToSend = {
      ...formValues,
      fechaModificacion: fechaFormatoAPI,
      ...(reglasPuntos ? { id } : {}),
    };

    try {
      if (reglasPuntos) {
        await actualizarReglasPuntos(dataToSend);
        setToastMessage("Las reglas de puntos han sido actualizadas.");
      } else {
        await registrarReglasPuntos(dataToSend);
        setToastMessage("Las reglas de puntos han sido registradas.");
      }
      navigate(-1);
    } catch (error) {
      console.error("Error al registrar o actualizar:", error);
      toast.error("Hubo un problema al procesar la solicitud.");
    }
  };

  return (
    <div className="container">
      <h1>{reglasPuntos ? "Actualizar" : "Registrar"} Reglas de Puntos</h1>

      <div className="p-field p-grid" style={{ width: "50%"}}>
        <label className="p-col-12 p-md-2">Valor MXN por Punto:</label>
        <div className="p-col-12 p-md-10">
          <InputText
            className="w-100"
            style={{ width: '100%' }}
            value={formValues.valorMXNPunto}
            onChange={(e) => handleChange("valorMXNPunto", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {errors.valorMXNPunto && <small className="p-error">{errors.valorMXNPunto}</small>}
        </div>
      </div>

      <div className="p-field p-grid" style={{ width: "50%"}}>
        <label className="p-col-12 p-md-2">Monto Mínimo:</label>
        <div className="p-col-12 p-md-10">
          <InputText
            className="w-100"
            style={{ width: '100%' }}
            value={formValues.montoMinimo}
            onChange={(e) => handleChange("montoMinimo", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {errors.montoMinimo && <small className="p-error">{errors.montoMinimo}</small>}
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: "50%"}}>
        <label className="p-col-12 p-md-2">Porcentaje de Conversión:</label>
        <div className="p-col-12 p-md-10">
          <InputText
            className="w-100"
            style={{ width: '100%' }}
            value={formValues.porcentajeConversion}
            onChange={(e) => handleChange("porcentajeConversion", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {errors.porcentajeConversion && <small className="p-error">{errors.porcentajeConversion}</small>}
        </div>
      </div>

      <br />
      <Button label={reglasPuntos ? "Actualizar" : "Registrar"} onClick={handleSubmit} className="p-button-primary" />

      {/* Toast */}
      <Toast ref={toastRef} />
      {toastMessage && toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail: toastMessage, life: 3000 })}
    </div>
  );
};

export default FormularioReglasPuntos;
