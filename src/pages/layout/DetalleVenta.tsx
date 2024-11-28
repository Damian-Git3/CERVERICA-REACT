import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useVentas from "../../hooks/useVentas";
import ModalVenta from "../../components/ModalVenta";
import { DetalleVenta } from "../../models/venta";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const DetalleVentaScreen = () => {
  const { selectedVenta, getVenta, retrocederStatus, empaquetar, cargando } = useVentas();
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      getVenta(Number(id));
    }
  }, [location]);

  useEffect(() => {
    if (!modalVisible) {
      handleUpdateVenta();
    }
  }, [modalVisible]);

  const handleUpdateVenta = async () => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      await getVenta(Number(id));
    }
  };

  const retrocederPaso = async (idVenta) => {
    confirmDialog({
      message: '¿Estás seguro de retroceder el estatus de esta venta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await retrocederStatus(idVenta);
          await handleUpdateVenta();
        } catch (error) {
          console.error("Error al retroceder el estatus:", error);
        }
      },
      reject: () => {
        // Acción en caso de rechazo
      }
    });
  };

  const avanzarEmpaquetar = async (idVenta) => {
    confirmDialog({
      message: '¿Estás seguro de avanzar al siguiente paso?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await empaquetar(idVenta);
          await handleUpdateVenta();
          setModalVisible(true);
        } catch (error) {
          console.error("Error al avanzar al siguiente paso:", error);
        }
      },
      reject: () => {
        // Acción en caso de rechazo
      }
    });
  };

  const mostrarModal = () => {
    setModalVisible(true);
  };

  const renderItem = (item) => (
    <div key={item.id} className="mb-2">
      <Card className="p-shadow-2">
        <div className="flex align-items-center">
          <img
            src={item.stock.receta.imagen}
            className="w-24 h-24 mr-2"
            alt={item.stock.receta.nombre}
          />
          <div className="flex-1">
            <p className="text-lg font-bold">{item.stock.receta.nombre}</p>
            <p className="text-base">Cantidad: {item.cantidad}</p>
            <p className="text-base">Pack: {item.pack} cervezas</p>
            <p className="text-base">Costo Unitario: {item.costoUnitario}</p>
            <p className="text-base">Total: {item.montoVenta}</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="p-5 surface-ground rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Venta</h2>
      <hr className="mb-5" />
      {error && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}
      {selectedVenta ? (
        <>
          <Card className="p-shadow-2 mb-4">
            <div className="grid">
              <div className="col-12 md:col-6">
                <p className="text-lg"><strong>ID:</strong> {selectedVenta.id}</p>
                <p className="text-lg">
                  <strong>Fecha de la venta:</strong>{" "}
                  {new Date(selectedVenta.fechaVenta).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-lg"><strong>Total de cervezas:</strong> {selectedVenta.totalCervezas}</p>
                <p className="text-lg"><strong>Metodo de envio:</strong> {obtenerMetodoEnvio(selectedVenta.metodoEnvio)}</p>
                <p className="text-lg"><strong>Metodo de pago:</strong> {obtenerMetodoPago(selectedVenta.metodoPago)}</p>
                <p className="text-lg">
                  <strong>Estatus:</strong>{" "}
                  <Badge value={obtenerNombreEstatusVenta(selectedVenta.estatusVenta)} severity={obtenerSeverityEstatusVenta(selectedVenta.estatusVenta)} />
                </p>
                <p className="text-lg"><strong>Monto:</strong> ${selectedVenta.montoVenta}</p>
              </div>
              <div className="col-12 md:col-6 flex flex-column align-items-center justify-content-center">
                {selectedVenta.estatusVenta !== 1 && (
                  <Button
                    label="Retroceder paso"
                    icon="pi pi-arrow-left"
                    className="p-button-danger mb-3"
                    onClick={() => retrocederPaso(selectedVenta.id)}
                  />
                )}
                {selectedVenta.estatusVenta === 1 && (
                  <Button
                    label="Empezar empaquetar cervezas"
                    icon="pi pi-beer"
                    className="p-button-success mb-3"
                    onClick={() => avanzarEmpaquetar(selectedVenta.id)}
                  />
                )}
                {selectedVenta.estatusVenta === 2 && (
                  <Button
                    label="Empaquetar cervezas"
                    icon="pi pi-beer"
                    className="p-button-warning mb-3"
                    onClick={mostrarModal}
                  />
                )}
              </div>
            </div>
          </Card>

          <h2 className="text-2xl font-bold mb-4 text-center">Detalle de Venta</h2>
          <hr className="mb-5" />
          <p className="text-lg">Productos:</p>
          <div className="mb-5">
            <h3 className="text-2xl font-bold">Venta total de: {selectedVenta.totalCervezas} cervezas</h3>
          </div>
          <div className="flex flex-column">
            {selectedVenta.productosPedido.map(renderItem)}
          </div>
          {selectedVenta.productosPedido.length === 0 && (
            <div className="flex justify-content-center align-items-center">
              {cargando ? (
                <ProgressSpinner />
              ) : (
                <>
                  <i className={`pi ${PrimeIcons.SEARCH_MINUS} p-mr-2`} style={{ fontSize: '2em' }}></i>
                  <p className="text-lg">No se encontraron ventas</p>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-content-center align-items-center">
          {cargando ? (
            <ProgressSpinner />
          ) : (
            <p className="text-lg">Cargando...</p>
          )}
        </div>
      )}
      <Dialog header="Empaquetar Cervezas" visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
        {selectedVenta && (
          <ModalVenta
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            venta={selectedVenta}
            empaquetandoPedidos={true}
            productosDisponibles={selectedVenta.productosPedido}
            cargando={false}
            id={selectedVenta.id}
          />
        )}
      </Dialog>
      <ConfirmDialog />
    </div>
  );
};

const obtenerMetodoEnvio = (metodoEnvio) => {
  switch (metodoEnvio) {
    case 1:
      return "Recoger en tienda 🏭";
    case 2:
      return "Envio domicilio 🚚";
    default:
      return "Método de envio Desconocido";
  }
};

const obtenerMetodoPago = (metodoPago) => {
  switch (metodoPago) {
    case 1:
      return "Contraentrega 💵";
    case 2:
      return "Tarjeta de credito 💳";
    default:
      return "Método de pago Desconocido";
  }
};

const obtenerNombreEstatusVenta = (estatusVenta) => {
  switch (estatusVenta) {
    case 1:
      return "Recibido ✅";
    case 2:
      return "Empaquetando 📦";
    case 3:
      return "Listo 🚚";
    default:
      return "Estatus desconocido";
  }
};

const obtenerSeverityEstatusVenta = (estatusVenta) => {
  switch (estatusVenta) {
    case 1:
      return "info";
    case 2:
      return "warning";
    case 3:
      return "success";
    default:
      return "default";
  }
};

const severityColors = {
  info: "primary",
  warning: "warning",
  success: "success",
  default: "secondary",
};

export default DetalleVentaScreen;