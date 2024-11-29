import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListaReporteVentas from "../../../components/ListaReporteVentas";
import { TabMenu } from 'primereact/tabmenu';

const ReporteVentasScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí puedes agregar cualquier lógica que necesites cuando la ruta cambie
  }, [location]);

  const items = [
    { label: 'Semana', icon: 'pi pi-calendar', command: () => { navigate("/reporte-ventas?param=semana"); }},
    { label: 'Mes', icon: 'pi pi-calendar-plus', command: () => { navigate("/reporte-ventas?param=mes"); }},
    { label: 'Año', icon: 'pi pi-calendar-times', command: () => { navigate("/reporte-ventas?param=anio"); }}
  ];

  const getParam = () => {
    const params = new URLSearchParams(location.search);
    return params.get('param') || 'semana';
  };

  return (
    <div className="p-4 surface-ground">
      <TabMenu model={items} />
      <ListaReporteVentas param={getParam()} />
    </div>
  );
};

export default ReporteVentasScreen;