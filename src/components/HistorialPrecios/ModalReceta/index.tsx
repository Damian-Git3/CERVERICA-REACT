import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";
import useHistorialPrecios from "../../../hooks/useHistorialPrecios";
import NuevoHistorialModal from "../NuevoHistorialModal";
import "./styles.css";

interface ModalRecetaProps {
  modalVisible: boolean;
  idReceta: number | undefined;
  setReload: (reload: boolean) => void;
  setModalVisible: (visible: boolean) => void;
}

const ModalReceta: React.FC<ModalRecetaProps> = ({
  modalVisible = false,
  idReceta,
  setReload,
  setModalVisible,
}) => {
  const { getReceta, receta, getHistorialPrecios, historialPrecios } = useHistorialPrecios();

  const [modalNuevoHistorialVisible, setModalNuevoHistorialVisible] = useState(false);
  const [reloadReceta, setReloadReceta] = useState<boolean>(false);

  useEffect(() => {
    console.log("modalRecetaVisible", modalVisible);
    if (modalVisible && idReceta) {
      getReceta(idReceta);
      getHistorialPrecios(idReceta);
    }
  }, [idReceta]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("reloadReceta", reloadReceta);
      console.log("idReceta", idReceta);
      if (reloadReceta && idReceta) {
        await getReceta(idReceta);
        await getHistorialPrecios(idReceta);
        setReloadReceta(false);
      }
    };
    fetchData();
  }, [reloadReceta]);

  const onHide = () => {
    setModalVisible(false);
    setReload(true);
  };

  useEffect(() => {
    console.log("receta", receta);
  }, [receta]);

  const footerContent = (
    <div className="grid gap-1 justify-content-center pt-6">
      <Button
        label="Cambio de Precio"
        icon="pi pi-dollar"
        onClick={() => setModalNuevoHistorialVisible(true)}
        className="p-mt-2"
      />
      <Button
        label="Cerrar"
        icon="pi pi-times-circle"
        onClick={() => {
          onHide();
        }}
        className="p-mt-2"
      />
    </div>
  );

  

  return (
    <Dialog
      header="Detalles de la Receta"
      visible={modalVisible}
      style={{ width: "75%" }}
      onHide={() => {
        onHide();
      }}
      footer={footerContent}
    >
      <div className="flex flex-column align-items-center">
        <div className="grid border border-5 w-full pt-2">
          <div className="col-5  flex justify-content-center">
            <div className="shadow-6 image-container">
              <img src={receta?.imagen} alt={receta?.nombre} className="image-style" />
            </div>
          </div>
          <div className="col-7  flex flex-column justify-content-center align-items-center">
            <div className="w-full h-50  flex justify-content-center align-items-center">
              <span className="title-style">{receta?.nombre}</span>
            </div>
            <div className="w-full h-50  flex justify-content-center align-items-center">
              <Tag
                severity={receta?.activo ? "success" : "danger"}
                value={receta?.activo ? "Activo" : "Inactivo"}
                className="tag-style"
              ></Tag>
            </div>
          </div>
        </div>

        <div className="formgrid grid my-3">
          <div className="my-3 col-12">
            <FloatLabel>
              <InputNumber
                disabled
                id="id"
                value={receta?.id}
                className="p-inputtext-sm w-full"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <label htmlFor="id">ID</label>
            </FloatLabel>
          </div>
          <div className="my-3 col-6">
            <FloatLabel>
              <InputNumber
                disabled
                id="precioLitro"
                value={receta?.precioLitro}
                className="p-inputtext-sm w-full"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <label htmlFor="precioLitro">Precio Litro</label>
            </FloatLabel>
          </div>
          <div className="my-3 col-6">
            <FloatLabel>
              <InputNumber
                disabled
                id="precioPaquete1"
                value={receta?.precioPaquete1}
                className="p-inputtext-sm w-full"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <label htmlFor="precioPaquete1">Paquete 1</label>
            </FloatLabel>
          </div>
          <div className="my-3 col-6">
            <FloatLabel>
              <InputNumber
                disabled
                id="precioPaquete6"
                value={receta?.precioPaquete6}
                className="p-inputtext-sm w-full"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <label htmlFor="precioPaquete6">Paquete 6</label>
            </FloatLabel>
          </div>
          <div className="my-3 col-6">
            <FloatLabel>
              <InputNumber
                disabled
                id="precioPaquete12"
                value={receta?.precioPaquete12}
                className="p-inputtext-sm w-full"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <label htmlFor="precioPaquete12">Paquete 12</label>
            </FloatLabel>
          </div>
          <div className="my-3 col-6">
            <FloatLabel>
              <InputNumber
                disabled
                id="precioPaquete24"
                value={receta?.precioPaquete24}
                className="p-inputtext-sm w-full"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <label htmlFor="precioPaquete24">Paquete 24</label>
            </FloatLabel>
          </div>
          <div className="my-3 col-6">
            <FloatLabel>
              <InputNumber
                disabled
                id="precioBaseMayoreo"
                value={receta?.precioBaseMayoreo}
                className="p-inputtext-sm w-full"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <label htmlFor="precioBaseMayoreo">Precio Unitario Mayoreo</label>
            </FloatLabel>
          </div>
        </div>

        <h3>Historial de Precios</h3>
        {historialPrecios?.length === 0 ? (
          <p>Sin cambios de Precio</p>
        ) : (
          <div className="card shadow-7 w-full">
            <DataTable value={historialPrecios} paginator rows={5}>
              <Column
                field="fecha"
                header="Fecha"
                sortable
                body={(rowData) => new Date(rowData.fecha).toLocaleDateString()}
              />
              <Column
                field="precioPaquete1"
                header="P1"
                sortable
                body={(rowData) => `$${rowData.precioPaquete1.toFixed(2)}`}
              />
              <Column
                field="precioPaquete6"
                header="P6"
                sortable
                body={(rowData) => `$${rowData.precioPaquete6.toFixed(2)}`}
              />
              <Column
                field="precioPaquete12"
                header="P12"
                sortable
                body={(rowData) => `$${rowData.precioPaquete12.toFixed(2)}`}
              />
              <Column
                field="precioPaquete24"
                header="P24"
                sortable
                body={(rowData) => `$${rowData.precioPaquete24.toFixed(2)}`}
              />
              <Column
                field="precioUnitarioBaseMayoreo"
                header="PUBM"
                sortable
                body={(rowData) => `$${rowData.precioUnitarioBaseMayoreo.toFixed(2)}`}
              />
            </DataTable>
          </div>
        )}
      </div>

      {modalNuevoHistorialVisible && (
        <NuevoHistorialModal
          modalVisible={modalNuevoHistorialVisible}
          setModalVisible={setModalNuevoHistorialVisible}
          setReloadReceta={setReloadReceta}
          idReceta={receta?.id}
        />
      )}
    </Dialog>
  );
};

export default ModalReceta;
