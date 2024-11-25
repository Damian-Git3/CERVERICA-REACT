import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConfiguracionesGenerales from "../../../hooks/useConfiguracionesGenerales";
import { images } from "../../../constants/index";
import "./ConfiguracionesGenerales.css";

const ConfiguracionesGenerales = () => {
  const navigate = useNavigate();

  const {
    cargando,
    configuracionesGenerales,
    getConfiguracionesGenerales
  } = useConfiguracionesGenerales();

  useEffect(() => {
    const fetchConfiguracion = async () => {
      await getConfiguracionesGenerales();
    };

    console.log("configuracionesGenerales");
    console.log(configuracionesGenerales);
    fetchConfiguracion();
  }, []);

  const handleButtonClick = () => {
    if (configuracionesGenerales) {
      navigate("/(admin)/configuraciones/formularioConfiguracionesGenerales", {
        state: { configuracionesGenerales },
      });
    } else {
      navigate("/(admin)/configuraciones/formularioConfiguracionesGenerales");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Configuraciones Generales</h1>
      {cargando ? (
        <div className="spinner">Cargando...</div>
      ) : configuracionesGenerales ? (
        <div className="details">
          <p className="text">
            <span className="label">Mínimo Compra Envío Gratis:</span>{" "}
            {configuracionesGenerales.minimoCompraEnvioGratis} MXN
          </p>
          <p className="text">
            <span className="label">Promociones Automáticas:</span>{" "}
            {configuracionesGenerales.promocionesAutomaticas ? "Sí" : "No"}
          </p>
          <p className="text">
            <span className="label">Notificación Promociones WhatsApp:</span>{" "}
            {configuracionesGenerales.notificacionPromocionesWhatsApp ? "Sí" : "No"}
          </p>
          <p className="text">
            <span className="label">Notificación Promociones Email:</span>{" "}
            {configuracionesGenerales.notificacionPromocionesEmail ? "Sí" : "No"}
          </p>
          <p className="text">
            <span className="label">Tiempo Recordatorio Carrito Abandonado:</span>{" "}
            {configuracionesGenerales.tiempoRecordatorioCarritoAbandonado} minutos
          </p>
          <p className="text">
            <span className="label">
              Tiempo Recordatorio Recomendación Última Compra:
            </span>{" "}
            {configuracionesGenerales.tiempoRecordatorioRecomendacionUltimaCompra}{" "}
            minutos
          </p>
          <p className="text">
            <span className="label">Fecha de Modificación:</span>{" "}
            {new Date(
              configuracionesGenerales.fechaModificacion
            ).toLocaleDateString()}
          </p>
          <p className="text">
            <span className="label">Frecuencia Reclasificación Clientes:</span>{" "}
            {configuracionesGenerales.frecuenciaReclasificacionClientes} días
          </p>
          <p className="text">
            <span className="label">
              Frecuencia Mínima Mensual Cliente Frecuente:
            </span>{" "}
            {configuracionesGenerales.frecuenciaMinimaMensualClienteFrecuente} meses
          </p>
          <p className="text">
            <span className="label">Tiempo Sin Compras Cliente Inactivo:</span>{" "}
            {configuracionesGenerales.tiempoSinComprasClienteInactivo} días
          </p>
          <button className="button" onClick={handleButtonClick}>
            Actualizar la Configuración
          </button>
        </div>
      ) : (
        <div className="container-datos">
          <img
            src={images.noResult}
            className="no-result-image"
            alt="No se encontraron datos"
          />
          <p className="text-center">No existe la configuración general</p>
          <button className="button" onClick={handleButtonClick}>
            Registrar Configuración
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionesGenerales;
