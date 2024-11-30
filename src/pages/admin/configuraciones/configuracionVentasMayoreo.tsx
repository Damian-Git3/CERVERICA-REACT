import { useNavigate } from "react-router-dom";
import useConfiguracionVentasMayoreo from "../../../hooks/useConfiguracionVentasMayoreo";
import { images } from "../../../constants";
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect } from "react";
import { Card } from "primereact/card";
import { Divider } from 'primereact/divider';


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
    <div className="p-m-4">
      <h1 className="p-text-center">Configuración de Ventas de Mayoreo</h1>
      {cargando ? (
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      ) : configuracionVentasMayoreo ? (
        <Card>
          <div className="p-mb-3">
            <h3>Configuración Actual</h3>
            <Divider />
            <div>
              <p>
                <span className="config-label">Plazo Máximo de Pago:</span>{" "}
                {configuracionVentasMayoreo.plazoMaximoPago} días
              </p>
              <p>
                <span className="config-label">Pagos Mensuales:</span>{" "}
                {configuracionVentasMayoreo.pagosMensuales ? "Sí" : "No"}
              </p>
              <p>
                <span className="config-label">Monto Mínimo Mayorista:</span>{" "}
                {configuracionVentasMayoreo.montoMinimoMayorista} MXN
              </p>
              <p>
                <span className="config-label">Fecha de Modificación:</span>{" "}
                {new Date(
                  configuracionVentasMayoreo.fechaModificacion
                ).toLocaleDateString()}
              </p>
              <Button
                label="Actualizar la Configuración"
                icon="pi pi-pencil"
                onClick={handleButtonClick}
                className="p-button-success"
              />
            </div>
          </div>
        </Card>
      ) : (
        <div className="p-d-flex p-flex-column p-align-items-center">
          <img src={images.noResult} className="p-mb-3" alt="No se encontraron datos" />
          <p className="p-text-center">No existe la configuración de ventas de mayoreo</p>
          <Button label="Registrar Configuración" icon="pi pi-plus" onClick={handleButtonClick} className="p-button-warning" />
        </div>
      )}
    </div>
  );
};

export default ConfiguracionVentasMayoreo;
