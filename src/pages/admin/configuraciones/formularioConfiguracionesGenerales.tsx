import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "antd";  // Importa el Switch de Ant Design
import "./FormularioConfiguracionesGenerales.css";
import useConfiguracionesGenerales from "../../../hooks/useConfiguracionesGenerales";

interface IConfiguracionesGenerales {
  id: number;
  minimoCompraEnvioGratis: number;
  promocionesAutomaticas: boolean;
  notificacionPromocionesWhatsApp: boolean;
  notificacionPromocionesEmail: boolean;
  tiempoRecordatorioCarritoAbandonado: number;
  tiempoRecordatorioRecomendacionUltimaCompra: number;
  fechaModificacion: string;
  frecuenciaReclasificacionClientes: number;
  frecuenciaMinimaMensualClienteFrecuente: number;
  tiempoSinComprasClienteInactivo: number;
}

const FormularioConfiguracionesGenerales: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const configuracion = location.state?.configuracionesGenerales || null;

  const {
    registrarConfiguracionesGenerales,
    actualizarConfiguracionesGenerales,
  } = useConfiguracionesGenerales();

  const [formValues, setFormValues] = useState<IConfiguracionesGenerales>({
    id: configuracion?.id || 0,
    minimoCompraEnvioGratis: configuracion?.minimoCompraEnvioGratis || 0,
    promocionesAutomaticas: configuracion?.promocionesAutomaticas || false,
    notificacionPromocionesWhatsApp: configuracion?.notificacionPromocionesWhatsApp || false,
    notificacionPromocionesEmail: configuracion?.notificacionPromocionesEmail || false,
    tiempoRecordatorioCarritoAbandonado: configuracion?.tiempoRecordatorioCarritoAbandonado || 0,
    tiempoRecordatorioRecomendacionUltimaCompra: configuracion?.tiempoRecordatorioRecomendacionUltimaCompra || 0,
    fechaModificacion: new Date().toISOString(),
    frecuenciaReclasificacionClientes: configuracion?.frecuenciaReclasificacionClientes || 0,
    frecuenciaMinimaMensualClienteFrecuente: configuracion?.frecuenciaMinimaMensualClienteFrecuente || 0,
    tiempoSinComprasClienteInactivo: configuracion?.tiempoSinComprasClienteInactivo || 0,
  });

  const handleChange = (name: string, value: string) => {
    // Validar que los valores numéricos sean correctos
    if (name === "minimoCompraEnvioGratis" || name === "tiempoRecordatorioCarritoAbandonado" || 
        name === "tiempoRecordatorioRecomendacionUltimaCompra" || name === "frecuenciaReclasificacionClientes" ||
        name === "frecuenciaMinimaMensualClienteFrecuente" || name === "tiempoSinComprasClienteInactivo") {
      const numericValue = value.replace(/[^0-9.]/g, ""); // Eliminar cualquier cosa que no sea número o punto decimal
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: numericValue ? parseFloat(numericValue) : 0, // Asegura que el valor siempre sea un número
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: checked, // Cambia el estado del switch
    }));
  };

  const handleSubmit = async () => {
    const fechaModificacion = new Date().toISOString();
    const dataToSend = { ...formValues, fechaModificacion };

    // Validación antes de enviar el formulario
    if (formValues.minimoCompraEnvioGratis <= 0) {
      toast.error("El mínimo de compra para envío gratis debe ser un valor positivo.");
      return;
    }

    if (formValues.tiempoRecordatorioCarritoAbandonado <= 0) {
      toast.error("El tiempo de recordatorio del carrito abandonado debe ser un valor positivo.");
      return;
    }

    try {
      if (configuracion) {
        // Actualizar configuración
        await actualizarConfiguracionesGenerales(dataToSend);
        console.log("Actualizando configuración:", dataToSend);
        toast.success("La configuración general ha sido actualizada.");
      } else {
        // Registrar nueva configuración
        await registrarConfiguracionesGenerales(dataToSend);
        console.log("Registrando nueva configuración:", dataToSend);
        toast.success("La configuración general ha sido registrada.");
      }
      navigate(-1); // Regresar a la página anterior
    } catch (error) {
      console.error("Error al registrar o actualizar:", error);
      toast.error("Hubo un problema al procesar la solicitud.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">{configuracion ? "Actualizar" : "Registrar"} Configuraciones Generales</h1>

      <div className="form-group">
        <label>Promociones Automáticas:</label>
        <Switch
          checked={formValues.promocionesAutomaticas}
          onChange={(checked) => handleSwitchChange("promocionesAutomaticas", checked)}
        />
      </div>

      <div className="form-group">
        <label>Notificación Promociones WhatsApp:</label>
        <Switch
          checked={formValues.notificacionPromocionesWhatsApp}
          onChange={(checked) => handleSwitchChange("notificacionPromocionesWhatsApp", checked)}
        />
      </div>

      <div className="form-group">
        <label>Notificación Promociones Email:</label>
        <Switch
          checked={formValues.notificacionPromocionesEmail}
          onChange={(checked) => handleSwitchChange("notificacionPromocionesEmail", checked)}
        />
      </div>

      <div className="form-group">
        <label>Mínimo Compra Envío Gratis:</label>
        <input
          type="text"
          className="input"
          value={formValues.minimoCompraEnvioGratis}
          onChange={(e) => handleChange("minimoCompraEnvioGratis", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tiempo Recordatorio Carrito Abandonado (min):</label>
        <input
          type="text"
          className="input"
          value={formValues.tiempoRecordatorioCarritoAbandonado}
          onChange={(e) => handleChange("tiempoRecordatorioCarritoAbandonado", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tiempo Recordatorio Recomendación Última Compra (min):</label>
        <input
          type="text"
          className="input"
          value={formValues.tiempoRecordatorioRecomendacionUltimaCompra}
          onChange={(e) => handleChange("tiempoRecordatorioRecomendacionUltimaCompra", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Frecuencia Reclasificación Clientes (días):</label>
        <input
          type="text"
          className="input"
          value={formValues.frecuenciaReclasificacionClientes}
          onChange={(e) => handleChange("frecuenciaReclasificacionClientes", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Frecuencia Mínima Mensual Cliente Frecuente:</label>
        <input
          type="text"
          className="input"
          value={formValues.frecuenciaMinimaMensualClienteFrecuente}
          onChange={(e) => handleChange("frecuenciaMinimaMensualClienteFrecuente", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tiempo Sin Compras Cliente Inactivo (días):</label>
        <input
          type="text"
          className="input"
          value={formValues.tiempoSinComprasClienteInactivo}
          onChange={(e) => handleChange("tiempoSinComprasClienteInactivo", e.target.value)}
        />
      </div>

      <button className="button" onClick={handleSubmit}>
        {configuracion ? "Actualizar" : "Registrar"} Configuración
      </button>

      <ToastContainer />
    </div>
  );
};

export default FormularioConfiguracionesGenerales;
