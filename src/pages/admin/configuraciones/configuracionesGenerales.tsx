import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useConfiguracionesGenerales from "../../../hooks/useConfiguracionesGenerales";
import { images } from "../../../constants/index";
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';

const ConfiguracionesGenerales = () => {
  const navigate = useNavigate();
  const toast = useRef(null);  // Refs para mostrar notificaciones

  const {
    cargando,
    configuracionesGenerales,
    getConfiguracionesGenerales
  } = useConfiguracionesGenerales();

  useEffect(() => {
    const fetchConfiguracion = async () => {
      await getConfiguracionesGenerales();
    };

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
    <div className="p-m-4">
      <h1 className="p-text-center">Configuraciones Generales</h1>
      {cargando ? (
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      ) : configuracionesGenerales ? (
        <Card>
          <div className="p-mb-3">
            <h3>Configuración Actual</h3>
            <Divider />
            <p><strong>Mínimo Compra Envío Gratis:</strong> {configuracionesGenerales.minimoCompraEnvioGratis} MXN</p>
            <p><strong>Promociones Automáticas:</strong> {configuracionesGenerales.promocionesAutomaticas ? "Sí" : "No"}</p>
            <p><strong>Notificación Promociones WhatsApp:</strong> {configuracionesGenerales.notificacionPromocionesWhatsApp ? "Sí" : "No"}</p>
            <p><strong>Notificación Promociones Email:</strong> {configuracionesGenerales.notificacionPromocionesEmail ? "Sí" : "No"}</p>
            <p><strong>Tiempo Recordatorio Carrito Abandonado:</strong> {configuracionesGenerales.tiempoRecordatorioCarritoAbandonado} minutos</p>
            <p><strong>Tiempo Recordatorio Recomendación Última Compra:</strong> {configuracionesGenerales.tiempoRecordatorioRecomendacionUltimaCompra} minutos</p>
            <p><strong>Fecha de Modificación:</strong> {new Date(configuracionesGenerales.fechaModificacion).toLocaleDateString()}</p>
            <p><strong>Frecuencia Reclasificación Clientes:</strong> {configuracionesGenerales.frecuenciaReclasificacionClientes} días</p>
            <p><strong>Frecuencia Mínima Mensual Cliente Frecuente:</strong> {configuracionesGenerales.frecuenciaMinimaMensualClienteFrecuente} meses</p>
            <p><strong>Tiempo Sin Compras Cliente Inactivo:</strong> {configuracionesGenerales.tiempoSinComprasClienteInactivo} días</p>
            <Button label="Actualizar la Configuración" icon="pi pi-pencil" onClick={handleButtonClick} className="p-button-success" />
          </div>
        </Card>
      ) : (
        <div className="p-d-flex p-flex-column p-align-items-center">
          <img src={images.noResult} className="p-mb-3" alt="No se encontraron datos" />
          <p className="p-text-center">No existe la configuración general</p>
          <Button label="Registrar Configuración" icon="pi pi-plus" onClick={handleButtonClick} className="p-button-warning" />
        </div>
      )}
    </div>
  );
};

export default ConfiguracionesGenerales;
