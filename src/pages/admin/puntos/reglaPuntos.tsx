import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { images } from "../../../constants";
import usePuntosFidelidad from "../../../hooks/usePuntosFidelidad";
import { Card } from "primereact/card";
import { Divider } from 'primereact/divider';

const ReglaPuntos = () => {
  const {
    cargando,
    reglasPuntos,
    getReglasPuntos,
  } = usePuntosFidelidad();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getReglasPuntos();
    };

    fetchData();
  }, []);

  const handleButtonClick = () => {
    if (reglasPuntos) {
      navigate("/(admin)/puntos/formularioReglasPuntos", { state: { reglasPuntos } });
    } else {
      navigate("/(admin)/puntos/formularioReglasPuntos");
    }
  };

  return (
    <div className="p-m-4">
      <h1 className="p-text-center">Reglas de Puntos de Fidelidad</h1>
      {cargando ? (
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      ) : reglasPuntos ? (
        <Card>
          <div className="p-mb-3">
            <h3>Reglas Actuales</h3>
            <Divider />
            <p><strong>Valor MXN por Punto:</strong> {reglasPuntos.valorMXNPunto}</p>
            <p><strong>Monto Mínimo:</strong> {reglasPuntos.montoMinimo}</p>
            <p><strong>Porcentaje de Conversión:</strong> {reglasPuntos.porcentajeConversion}</p>
            <p><strong>Fecha de Modificación:</strong> {new Date(reglasPuntos.fechaModificacion).toLocaleDateString()}</p>
            <Button icon="pi pi-pencil" label="Actualizar Reglas de Puntos" onClick={handleButtonClick} className="p-button-success" />
          </div>
        </Card>
      ) : (
        <div className="p-d-flex p-flex-column p-align-items-center">
          <img src={images.noResult} className="p-mb-3" alt="No se encontraron datos" />
          <p className="p-text-center">No existen reglas de puntos</p>
          <Button label="Registrar Reglas de puntos" icon="pi pi-plus" onClick={handleButtonClick} className="p-button-success" />
        </div>
      )}
    </div>
  );
};

export default ReglaPuntos;
