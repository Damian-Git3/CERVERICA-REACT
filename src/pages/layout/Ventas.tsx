import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableResumenVentas from "../../components/TableResumenVentas";
import ListVentas from "../../components/ListVentas";

const Ventas = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    setIsRefreshing(false);
  };


  const navigateToReporte = (param) => {
    navigate(`/reporte-ventas?param=${param}`);
  };

  return (
    <div className="flex-1 bg-gray-100 p-4">
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-2">Lista de ventas</h2>
        <div className="border-b border-gray-300" />
        <ListVentas />
      </div>

      <div className="flex-2 mb-2">
        <h2 className="text-lg font-bold mb-2">Resumen de tus ventas</h2>
        <div className="border-b border-gray-300 mb-5" />
        <TableResumenVentas navigateToReporte={navigateToReporte} />
      </div>

      <div className="flex-row justify-between mt-5">
        <button
          onClick={onRefresh}
          className="justify-center items-center py-2 px-4 rounded-full bg-orange-500"
        >
          <span className="text-white text-lg">Recargar</span>
        </button>
      </div>
    </div>
  );
};

export default Ventas;