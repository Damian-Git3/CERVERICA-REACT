import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useVentas from "../hooks/useVentas";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const ListaReporteVentas = ({ param }) => {
  const { reporteVentas, getReporteVentas } = useVentas();
  const location = useLocation();

  useEffect(() => {
    console.log("useEffect");
    if (getReporteVentas) {
      console.log("getReporteVentas for period:", param);
      getReporteVentas(param);
    }
    console.log("reporteVentas", reporteVentas);
  }, [param, location]);

  return (
    <div className="p-4">
      <Card title={`Reporte de Ventas (${param})`} className="p-shadow-2 p-p-4">
        <h2 className="text-lg mb-4">Total: ${reporteVentas?.total}</h2>
        {reporteVentas && (
          <DataTable value={reporteVentas.data} className="p-datatable-gridlines">
            <Column field="date" header="Fecha" />
            <Column field="monto" header="Monto" body={(data) => `$${data.monto}`} />
          </DataTable>
        )}
      </Card>
    </div>
  );
};

export default ListaReporteVentas;