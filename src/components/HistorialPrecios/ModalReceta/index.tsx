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

interface ModalRecetaProps {
  modalVisible: boolean;
  idReceta: number | undefined;
  setModalVisible: (visible: boolean) => void;
}

const ModalReceta: React.FC<ModalRecetaProps> = ({
  modalVisible = false,
  idReceta,
  setModalVisible,
}) => {
  const { getReceta, receta, getHistorialPrecios, historialPrecios } =
    useHistorialPrecios();

  const [modalNuevoHistorialVisible, setModalNuevoHistorialVisible] =
    useState(false);

  useEffect(() => {
    if (modalVisible && idReceta) {
      getReceta(idReceta);
      getHistorialPrecios(idReceta);
    }
  }, [idReceta, modalVisible]);

  useEffect(() => {
    const fetchHistorialPrecios = async () => {
      console.log(modalNuevoHistorialVisible);
      console.log(idReceta);
      if (modalNuevoHistorialVisible == false && idReceta) {
        await getHistorialPrecios(idReceta);
      }
    };
    fetchHistorialPrecios();
  }, [modalNuevoHistorialVisible]);

  useEffect(() => {
    console.log(receta);
  }, [receta]);

  const footerContent = (
    <div className="grid gap-1 justify-content-center">
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
          setModalVisible(false);
        }}
        className="p-mt-2"
      />
    </div>
  );

  return (
    <Dialog
      header="Detalles de la Receta"
      visible={modalVisible}
      style={{ width: "50vw" }}
      onHide={() => {
        setModalVisible(false);
      }}
      footer={footerContent}
    >
      <div className="flex flex-column align-items-center">
        <img
          src={receta?.imagen}
          alt={receta?.nombre}
          style={{ width: 100, height: 100 }}
        />
        <h2>{receta?.nombre}</h2>
        <Tag
          severity={receta?.activo ? "success" : "danger"}
          value={receta?.activo ? "Activo" : "Inactivo"}
        ></Tag>

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
              body={(rowData) =>
                `$${rowData.precioUnitarioBaseMayoreo.toFixed(2)}`
              }
            />
          </DataTable>
        )}
      </div>
      <NuevoHistorialModal
        modalVisible={modalNuevoHistorialVisible}
        setModalVisible={setModalNuevoHistorialVisible}
        idReceta={receta?.id}
      />
    </Dialog>
  );
};

export default ModalReceta;
