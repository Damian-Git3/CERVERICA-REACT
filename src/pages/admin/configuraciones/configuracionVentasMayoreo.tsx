import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConfiguracionVentasMayoreo from "../../../hooks/useConfiguracionVentasMayoreo";
import { images } from "../../../constants";
import "./ConfiguracionVentasMayoreo.css";

const ConfiguracionVentasMayoreo = () => {
  const navigate = useNavigate();
  const {
    cargando,
    configuracionVentasMayoreo,
    getConfiguracionVentasMayoreo,
  } = useConfiguracionVentasMayoreo();

  useEffect(() => {
    const fetchConfiguracion = async () => {
      await getConfiguracionVentasMayoreo();
    };

    fetchConfiguracion();
  }, []);

  const handleButtonClick = () => {
    if (configuracionVentasMayoreo) {
      navigate("/(admin)/configuraciones/formularioConfiguracionVentasMayoreo", {
        state: { configuracionVentasMayoreo },
      });
    } else {
      navigate("/(admin)/configuraciones/formularioConfiguracionVentasMayoreo");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Configuración de Ventas de Mayoreo</h1>
      {cargando ? (
        <div className="config-loader">Cargando...</div>
      ) : configuracionVentasMayoreo ? (
        <div className="config-details">
          <p className="config-text">
            <span className="config-label">Plazo Máximo de Pago:</span>{" "}
            {configuracionVentasMayoreo.plazoMaximoPago} días
          </p>
          <p className="config-text">
            <span className="config-label">Pagos Mensuales:</span>{" "}
            {configuracionVentasMayoreo.pagosMensuales ? "Sí" : "No"}
          </p>
          <p className="config-text">
            <span className="config-label">Monto Mínimo Mayorista:</span>{" "}
            {configuracionVentasMayoreo.montoMinimoMayorista} MXN
          </p>
          <p className="config-text">
            <span className="config-label">Fecha de Modificación:</span>{" "}
            {new Date(
              configuracionVentasMayoreo.fechaModificacion
            ).toLocaleDateString()}
          </p>
          <button
            className="button"
            onClick={handleButtonClick}
          >
            Actualizar la Configuración
          </button>
        </div>
      ) : (
        <div className="config-container-datos">
          <img
            src={images.noResult}
            className="config-image"
            alt="No se encontraron solicitudes de mayoristas"
          />
          <p className="config-text-center">
            No existe la configuración de ventas de mayoreo
          </p>
          <button
            className="button"
            onClick={handleButtonClick}
          >
            Registrar Configuración
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionVentasMayoreo;
