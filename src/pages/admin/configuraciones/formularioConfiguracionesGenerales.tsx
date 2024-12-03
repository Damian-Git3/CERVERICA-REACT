import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConfiguracionesGenerales from "../../../hooks/useConfiguracionesGenerales";
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext'; // PrimeReact InputText
import { Button } from 'primereact/button'; // PrimeReact Button

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
    const fechaSolicitud = new Date();
    const year = fechaSolicitud.getFullYear();
    const month = String(fechaSolicitud.getMonth() + 1).padStart(2, "0");
    const day = String(fechaSolicitud.getDate()).padStart(2, "0");
    const hours = String(fechaSolicitud.getHours()).padStart(2, "0");
    const minutes = String(fechaSolicitud.getMinutes()).padStart(2, "0");
    const seconds = String(fechaSolicitud.getSeconds()).padStart(2, "0");
    const milliseconds = String(fechaSolicitud.getMilliseconds()).padStart(3, "0");

    const fechaModificacion = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;


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

  return (
    <div className="container">
      <h1>{configuracion ? "Actualizar" : "Registrar"} Configuraciones Generales</h1>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Promociones Automáticas:</label>
        <div className="p-col-12 p-md-10">
          <InputSwitch
            checked={formValues.promocionesAutomaticas}
            onChange={(e) => handleChange('promocionesAutomaticas', e.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Notificación Promociones WhatsApp:</label>
        <div className="p-col-12 p-md-10">
          <InputSwitch
            checked={formValues.notificacionPromocionesWhatsApp}
            onChange={(e) => handleChange('notificacionPromocionesWhatsApp', e.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Notificación Promociones Email:</label>
        <div className="p-col-12 p-md-10">
          <InputSwitch
            checked={formValues.notificacionPromocionesEmail}
            onChange={(e) => handleChange('notificacionPromocionesEmail', e.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Mínimo Compra Envío Gratis:</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            value={formValues.minimoCompraEnvioGratis}
            onChange={(e) => handleChange("minimoCompraEnvioGratis", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Tiempo Recordatorio Carrito Abandonado (min):</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            value={formValues.tiempoRecordatorioCarritoAbandonado}
            onChange={(e) => handleChange("tiempoRecordatorioCarritoAbandonado", e.target.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Tiempo Recordatorio Recomendación Última Compra (min):</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            value={formValues.tiempoRecordatorioRecomendacionUltimaCompra}
            onChange={(e) => handleChange("tiempoRecordatorioRecomendacionUltimaCompra", e.target.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Frecuencia Reclasificación Clientes (días):</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            value={formValues.frecuenciaReclasificacionClientes}
            onChange={(e) => handleChange("frecuenciaReclasificacionClientes", e.target.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Frecuencia Mínima Mensual Cliente Frecuente:</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            value={formValues.frecuenciaMinimaMensualClienteFrecuente}
            onChange={(e) => handleChange("frecuenciaMinimaMensualClienteFrecuente", e.target.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label className="p-col-12 p-md-2">Tiempo Sin Compras Cliente Inactivo (días):</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            value={formValues.tiempoSinComprasClienteInactivo}
            onChange={(e) => handleChange("tiempoSinComprasClienteInactivo", e.target.value)}
          />
        </div>
      </div>

      <br />

      <Button label={configuracion ? "Actualizar" : "Registrar"} onClick={handleSubmit} className="p-button-primary" />

      <ToastContainer />
    </div>
  );
};

export default FormularioConfiguracionesGenerales;
