import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify"; // Asegúrate de importar 'toast' correctamente
import usePuntosFidelidad from "../../../hooks/usePuntosFidelidad";
import { ReglasPuntosDto } from "../../../dtos/puntosFidelidad";
import "./formularioReglasPuntos.css";

const FormularioReglasPuntos: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reglasPuntos = location.state?.reglasPuntos || null;

  const { registrarReglasPuntos, actualizarReglasPuntos } = usePuntosFidelidad();

  const [formValues, setFormValues] = useState<ReglasPuntosDto>({
    valorMXNPunto: reglasPuntos?.valorMXNPunto || 0,
    montoMinimo: reglasPuntos?.montoMinimo || 0,
    porcentajeConversion: reglasPuntos?.porcentajeConversion || 0,
    fechaModificacion: "", // Cambia a cadena para luego formatear
  });

  const [id, setId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (reglasPuntos) {
      setFormValues({
        valorMXNPunto: reglasPuntos.valorMXNPunto,
        montoMinimo: reglasPuntos.montoMinimo,
        porcentajeConversion: reglasPuntos.porcentajeConversion,
        fechaModificacion: reglasPuntos.fechaModificacion || "", // Carga la fecha si existe
      });
      setId(reglasPuntos.id);
    }
  }, [reglasPuntos]);

  const handleChange = (name: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value === "" ? 0 : parseFloat(value), // Si el valor es vacío, asigna 0
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Permite solo números, punto decimal y teclas de control (backspace, tab, etc.)
    if (
      !/[\d.]/.test(e.key) && // Permitir solo números y punto decimal
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
    if (formValues.valorMXNPunto!! <= 0) formErrors.valorMXNPunto = "Valor MXN por Punto debe ser mayor a 0";
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

    // Obtener la fecha de modificación formateada
    const fechaSolicitud = new Date();
    const year = fechaSolicitud.getFullYear();
    const month = String(fechaSolicitud.getMonth() + 1).padStart(2, "0"); // Mes comienza en 0
    const day = String(fechaSolicitud.getDate()).padStart(2, "0");
    const hours = String(fechaSolicitud.getHours()).padStart(2, "0");
    const minutes = String(fechaSolicitud.getMinutes()).padStart(2, "0");
    const seconds = String(fechaSolicitud.getSeconds()).padStart(2, "0");
    const milliseconds = String(fechaSolicitud.getMilliseconds()).padStart(3, "0");

    // Formatear como cadena ISO
    const fechaFormatoAPI = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    const dataToSend = {
      ...formValues,
      fechaModificacion: fechaFormatoAPI, // Asigna la fecha formateada
      ...(reglasPuntos ? { id } : {}),
    };

    try {
      if (reglasPuntos) {
        console.log(dataToSend);
        await actualizarReglasPuntos(dataToSend);
        toast.success("Las reglas de puntos han sido actualizadas."); 
      } else {
        await registrarReglasPuntos(dataToSend);
        toast.success("Las reglas de puntos han sido registradas."); 
      }
      navigate(-1); 
    } catch (error) {
      console.error("Error al registrar o actualizar:", error);
      toast.error("Hubo un problema al procesar la solicitud."); // Usa 'toast.error'
    }
  };

  return (
    <div className="container">
      <h1  className="title">{reglasPuntos ? "Actualizar" : "Registrar"} Reglas de Puntos</h1>

      <div className="form-group">
        <label className="label">Valor MXN por Punto:</label>
        <input
          className="input"
          type="text"
          value={formValues.valorMXNPunto}
          onChange={(e) => handleChange("valorMXNPunto", e.target.value)}
          onKeyDown={handleKeyDown} // Limitar a números
        />
        {errors.valorMXNPunto && <span className="error">{errors.valorMXNPunto}</span>}
      </div>

      <div className="form-group">
        <label className="label">Monto Mínimo:</label>
        <input
          className="input"
          type="text"
          value={formValues.montoMinimo}
          onChange={(e) => handleChange("montoMinimo", e.target.value)}
          onKeyDown={handleKeyDown} // Limitar a números
        />
        {errors.montoMinimo && <span className="error">{errors.montoMinimo}</span>}
      </div>

      <div className="form-group">
        <label className="label">Porcentaje de Conversión:</label>
        <input
          className="input"
          type="text"
          value={formValues.porcentajeConversion}
          onChange={(e) => handleChange("porcentajeConversion", e.target.value)}
          onKeyDown={handleKeyDown} // Limitar a números
        />
        {errors.porcentajeConversion && <span className="error">{errors.porcentajeConversion}</span>}
      </div>

      <button className="button" onClick={handleSubmit}>
        {reglasPuntos ? "Actualizar" : "Registrar"} Reglas
      </button>
    </div>
  );
};

export default FormularioReglasPuntos;
