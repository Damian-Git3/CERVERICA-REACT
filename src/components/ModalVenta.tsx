import React, { useState, useEffect, useCallback } from "react";
import { DetalleVenta } from "../models/venta";
import useVentas from "../hooks/useVentas";
import { ToastContainer, toast } from "react-toastify"; // Usando react-toastify para las notificaciones
import 'react-toastify/dist/ReactToastify.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos de PrimeReact
import 'primeflex/primeflex.css'; // Utilidades de PrimeFlex
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

interface ModalVentaProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  empaquetandoPedidos: boolean;
  productosDisponibles: DetalleVenta[];
  cargando: boolean;
  id: number;
}

const ModalVenta: React.FC<ModalVentaProps> = ({
  modalVisible,
  setModalVisible,
  empaquetandoPedidos,
  productosDisponibles,
  cargando,
  id,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const { empaquetar, getVenta } = useVentas();

  useEffect(() => {
    console.log("Productos disponibles", productosDisponibles);
  }, [productosDisponibles]);

  const toggleProductSelection = useCallback((item: DetalleVenta) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      return newSelected;
    });
  }, []);

  const finalizarVenta = async (idVenta: number) => {
    confirmDialog({
      message: '¿Estás seguro de finalizar esta venta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await empaquetar(idVenta);
          toast.success("Venta finalizada con éxito!");
          await getVenta(idVenta);
          setModalVisible(false);
        } catch (error) {
          toast.error("Error al finalizar la venta, intenta nuevamente");
          console.error(error);
        }
      },
      reject: () => {
        // Acción en caso de rechazo
      }
    });
  };

  return (
    <>
      <Dialog header={empaquetandoPedidos ? "Empaquetando venta" : "Empezar empaquetar venta"} visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
        <div className="p-fluid">
          {empaquetandoPedidos && (
            <div className="p-grid">
              {productosDisponibles.map((item) => (
                <div key={item.id} className="p-col-12 p-md-4">
                  <Card className="list-item-card">
                    <div className="list-item-content">
                      <Checkbox
                        inputId={`product-${item.id}`}
                        checked={selectedProducts.has(item.id)}
                        onChange={() => toggleProductSelection(item)}
                        className="p-mr-2"
                      />
                      <img
                        src={item.stock.receta.imagen}
                        alt={item.stock.receta.nombre}
                        className="list-item-image"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <div className="list-item-details">
                        <div className="flex justify-content-between flex-wrap">
                          <h2>{item.stock.receta.nombre}</h2>
                          <h3>{item.cantidad} paquetes</h3>
                        </div>
                        <p>Paquete de {item.pack}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
          {cargando && <div className="p-spinner p-component p-spinner-lg"></div>}
        </div>
        <div className="p-dialog-footer">
          <Button
            label="Finalizar venta"
            icon="pi pi-check"
            onClick={() => finalizarVenta(id)}
            disabled={selectedProducts.size !== productosDisponibles.length}
            className="p-button-primary"
          />
          <Button
            label="Cerrar"
            icon="pi pi-times"
            onClick={() => setModalVisible(false)}
            className="p-button-secondary"
          />
        </div>
      </Dialog>
      <ToastContainer />
      <ConfirmDialog />
    </>
  );
};

export default ModalVenta;