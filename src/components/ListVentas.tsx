import React, { useEffect, useState } from "react";
import useVentas from "../hooks/useVentas";
import { Venta } from "../models/venta";
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PrimeIcons } from 'primereact/api';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const ListVentas = () => {
  const { ventas, getVentas, cargando } = useVentas();
  const [searchText, setSearchText] = useState("");
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getVentas) {
      getVentas();
    }
  }, []);

  useEffect(() => {
    if (ventas) {
      setFilteredVentas(ventas);
    }
  }, [ventas]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = ventas.filter(
        (venta) =>
          venta.id.toString().includes(text) ||
          venta.fechaVenta.toLowerCase().includes(text.toLowerCase()) ||
          venta.totalCervezas.toString().includes(text) ||
          obtenerMetodoEnvio(venta.metodoEnvio)
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          obtenerMetodoPago(venta.metodoPago)
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          obtenerNombreEstatusVenta(venta.estatusVenta)
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          venta.montoVenta.toString().includes(text)
      );
      setFilteredVentas(filtered);
    } else {
      setFilteredVentas(ventas);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getVentas();
    setIsRefreshing(false);
  };

  const handlePressVenta = (id) => {
    navigate(`/(admin)/detalle-venta?id=${id}`);
  };

  return (
    <div className="p-4">
      <Card title="Lista de Ventas" className="p-shadow-2 p-p-4">
        <span className="p-input-icon-left mb-4">
          <i className="pi pi-search" />
          <InputText
            type="text"
            placeholder="Buscar"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-4"
          />
        </span>
        <DataTable value={filteredVentas} className="p-datatable-gridlines" onRowClick={(e) => handlePressVenta(e.data.id)}>
          <Column field="id" header="ID" />
          <Column field="fechaVenta" header="Fecha" body={(data) => new Date(data.fechaVenta).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })} />
          <Column field="totalCervezas" header="Total Cervezas" />
          <Column field="metodoEnvio" header="Método de Envío" body={(data) => obtenerMetodoEnvio(data.metodoEnvio)} />
          <Column field="metodoPago" header="Método de Pago" body={(data) => obtenerMetodoPago(data.metodoPago)} />
          <Column field="estatusVenta" header="Estatus" body={(data) => (
            <span className={`badge bg-${severityColors[obtenerSeverityEstatusVenta(data.estatusVenta)]}`}>
              {obtenerNombreEstatusVenta(data.estatusVenta)}
            </span>
          )} />
          <Column field="montoVenta" header="Monto" body={(data) => `$${data.montoVenta}`} />
        </DataTable>
        {cargando && <ProgressSpinner />}
        {filteredVentas.length === 0 && !cargando && (
          <div className="text-center">
            <i className={`pi ${PrimeIcons.SEARCH_MINUS} p-mr-2`} style={{ fontSize: '2em' }}></i>
            <p>No se encontraron ventas</p>
          </div>
        )}
        <Button label="Recargar" icon="pi pi-refresh" className="p-button-primary" onClick={onRefresh} />
      </Card>
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
        return "Tarjeta 💳";
      case 3:
        return "Stripe 💳";
      case 4:
        return "Plazos";
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

export default ListVentas;