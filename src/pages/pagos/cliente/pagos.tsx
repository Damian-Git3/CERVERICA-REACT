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
  const { pagos, getPagosPropiosMayorista } = usePagos();

  const [searchText, setSearchText] = useState("");
  const [estatus, setEstatus] = useState(null);
  const [filteredPagos, setFilteredPagos] = useState([]);

  const navigate = useNavigate();

  const estatusOptions = [
    { label: "Todos", value: null },
    { label: "Pendiente", value: 1 },
    { label: "Pagado", value: 2 },
    { label: "Impago", value: 3 },
  ];

  const toast = useContext(ToastContext);

  const handleVolver = () => {
    navigate("/mayoristas-asignados");
  };

  useEffect(() => {
    getPagosPropiosMayorista();
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

      const matchesEstatus =
        estatus?.value === null || estatus === pago.estatus;

      return matchesText && matchesEstatus;
    });
    setFilteredPagos(filtered);
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
      </DataTable>
    </div>
  );
};

export default Pagos;
