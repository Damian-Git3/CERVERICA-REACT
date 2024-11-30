import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import usePagos from "../../../hooks/usePagos";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContext } from "../../../App";
import "../pagos.css";

const Pagos = () => {
  const { pagos, getPagosMayorista, marcarPago } = usePagos();
  const [searchText, setSearchText] = useState("");
  const [estatus, setEstatus] = useState(null);
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [idPagoSeleccionado, setIdPagoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { id } = useParams();

  const idMayorista = id;

  const navigate = useNavigate();

  const estatusOptions = [
    { label: "Todos", value: null },
    { label: "Pendiente", value: 1 },
    { label: "Pagado", value: 2 },
    { label: "Impago", value: 3 },
  ];

  const toast = useContext(ToastContext);

  const showToast = ({
    severity = "error" as
      | "error"
      | "success"
      | "info"
      | "warn"
      | "secondary"
      | "contrast"
      | undefined,
    summary = "Error",
    detail = "No se pudo completar la acción.",
  }) => {
    toast?.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleVolver = () => {
    navigate("/mayoristas-asignados");
  };

  const handleMarcarPago = async () => {
    if (idPagoSeleccionado) {
      const res = await marcarPago(idPagoSeleccionado);
      getPagosMayorista(Number(idMayorista));
      return res;
    } else {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "No se pudo marcar el pago",
      });
    }
  };

  const handleConfirmSubmit = async () => {
    const res = await handleMarcarPago();
    setModalVisible(false);

    if (res?.status === 200) {
      showToast({
        severity: "success",
        summary: "Éxito",
        detail: "Pago reflejado",
      });
      getPagosMayorista(Number(idMayorista));
    } else {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "No se pudo marcar el pago",
      });
    }
  };

  useEffect(() => {
    getPagosMayorista(Number(idMayorista));
  }, []);

  useEffect(() => {
    filterSolicitudes();
  }, [searchText, estatus, pagos]);

  const filterSolicitudes = () => {
    if (!pagos) return;
    const filtered = pagos.filter((pago) => {
      const matchesText =
        pago.comprobante.toLowerCase().includes(searchText.toLowerCase()) ||
        (pago.fechaVencimiento &&
          new Date(pago.fechaVencimiento)
            .toLocaleDateString()
            .includes(searchText)) ||
        (pago.fechaPago &&
          new Date(pago.fechaPago).toLocaleDateString().includes(searchText)) ||
        pago.monto.toString().includes(searchText);

      const matchesEstatus = estatus === null || estatus === pago.estatus;

      return matchesText && matchesEstatus;
    });
    setFilteredPagos(filtered);
  };

  const renderActions = (rowData) => {
    if (rowData.estatus === 1) {
      return (
        <Button
          label="Reflejar Pago"
          icon="pi pi-check"
          className="p-button-success"
          onClick={() => {
            setIdPagoSeleccionado(rowData.id);
            setModalVisible(true);
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="pagos-container">
      <Toast ref={toast} />
      <h2>Pagos</h2>
      <Button
        label="⬅ Volver"
        className="p-button-secondary"
        onClick={handleVolver}
      />
      <br />
      <br />
      <div className="w-full d-flex align-items-center gap-2 column">
        <div className="flex-grow-1">
          <InputText
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar por comprobante, fecha o monto..."
            className="p-inputtext w-full"
          />
        </div>
        <div>
          <Dropdown
            value={estatus}
            options={estatusOptions}
            onChange={(e) => setEstatus(e.value)}
            placeholder="Seleccionar Estatus"
            className="p-dropdown"
          />
        </div>
      </div>

      <DataTable value={filteredPagos} paginator rows={5}>
        <Column field="id" header="ID" />
        <Column field="comprobante" header="Comprobante" />
        <Column
          field="fechaVencimiento"
          header="Fecha Vencimiento"
          body={(rowData) =>
            new Date(rowData.fechaVencimiento).toLocaleDateString()
          }
        />
        <Column
          field="fechaPago"
          header="Fecha Pago"
          body={(rowData) =>
            rowData.fechaPago
              ? new Date(rowData.fechaPago).toLocaleDateString()
              : "N/A"
          }
        />
        <Column field="monto" header="Monto" />
        <Column
          field="estatus"
          header="Estatus"
          body={(rowData) =>
            rowData.estatus === 1
              ? "Pendiente"
              : rowData.estatus === 2
              ? "Pagado"
              : "Impago"
          }
        />
        <Column body={renderActions} />
      </DataTable>

      <Dialog
        header="Confirmar Pago"
        visible={modalVisible}
        style={{ width: "50vw" }}
        onHide={() => setModalVisible(false)}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setModalVisible(false)}
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleConfirmSubmit}
            />
          </div>
        }
      >
        <p>¿Estás seguro de que deseas marcar el pago?</p>
      </Dialog>
    </div>
  );
};

export default Pagos;
