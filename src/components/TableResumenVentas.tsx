import React, { useEffect } from "react";
import useVentas from "../hooks/useVentas";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TableResumenVentas = ({ navigateToReporte }) => {
  const { resumenVentas, getResumenVentas } = useVentas();

  useEffect(() => {
    getResumenVentas();
    console.log("getResumenVentas");
    console.log("resumenVentas", resumenVentas);
  }, []);

  if (!resumenVentas) {
    return <div>Cargando...</div>;
  }

  const resumenData = [resumenVentas];

  return (
    <Card title="Resumen de Ventas" className="p-shadow-2 p-p-4">
      <DataTable value={resumenData} className="p-datatable-gridlines">
        <Column field="semana" header="Semana" body={(data) => `$${data.semana}`} className="text-center" />
        <Column field="mes" header="Mes" body={(data) => `$${data.mes}`} className="text-center" />
        <Column field="anio" header="Año" body={(data) => `$${data.anio}`} className="text-center" />
      </DataTable>
      <Button
        label="Ver detalle"
        icon="pi pi-search"
        className="p-button-primary p-mt-3"
        onClick={() => navigateToReporte("semana")}
      />
    </Card>
  );
};

export default TableResumenVentas;