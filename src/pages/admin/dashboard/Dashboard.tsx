import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";
import useGraficas from "../../../hooks/useGraficas";
import useVentas from "../../../hooks/useVentas";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const chartConfig = {
  backgroundColor: "#ffe0b2",
  borderColor: "#ffcc80",
  color: "#ff5722",
  labelColor: "#000000",
  borderWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 0,
};

const Dashboard = () => {
  const {
    cargando,
    nuevosClientesMes,
    ventasStatus,
    pedidosMetodoPago,
    productosMasVendidos,
    getNuevosClientesMes,
    getVentasStatus,
    getPedidosMetodoPago,
    getProductosMasVendidos,
  } = useGraficas();

  const { resumenVentas, getResumenVentas } = useVentas();
  const navigate = useNavigate();

  const graphData = (label, labels, dataset) => {
    return {
      labels: labels,
      datasets: [
        {
            label: label,
          data: dataset,
          backgroundColor: chartConfig.backgroundColor,
          borderColor: chartConfig.borderColor,
          borderWidth: chartConfig.borderWidth,
        },
      ],
    };
  };

  const graphDataClientes = (clientes) => {
    console.log("Clientes grafica", clientes);

    const clientesPorAnioYMes = clientes.reduce((acc, cliente) => {
      const key = `${cliente.año}-${String(cliente.mes).padStart(2, '0')}`;
      if (acc[key]) {
        acc[key] += cliente.nuevosClientes;
      } else {
        acc[key] = cliente.nuevosClientes;
      }
      return acc;
    }, {});

    console.log("Clientes por año y mes", clientesPorAnioYMes);

    const labels = Object.keys(clientesPorAnioYMes).map((key) => {
      const [year, month] = key.split("-");
      return `${month}/${year}`;
    });
    const data = Object.values(clientesPorAnioYMes).map((value) => Number(value));

    return {
      labels: labels,
      datasets: [
        {
          label: 'Nuevos Clientes',
          data: data,
          backgroundColor: chartConfig.backgroundColor,
          borderColor: chartConfig.borderColor,
          borderWidth: chartConfig.borderWidth,
        },
      ],
    };
  };

  const graphDataVentasStatus = (ventasStatus) => {
    const statusLabels = ["Recibido", "Empaquetando", "Listo"];
    const statusData = statusLabels.map(status => {
      const venta = ventasStatus.find(v => v.estatus === status);
      return venta ? venta.cantidad : 0;
    });

    return {
      labels: statusLabels,
      datasets: [
        {
          label: 'Ventas por Status',
          data: statusData,
          backgroundColor: chartConfig.backgroundColor,
          borderColor: chartConfig.borderColor,
          borderWidth: chartConfig.borderWidth,
        },
      ],
    };
  };

  const obtenerMetodoPago = (metodoPago) => {
    switch (metodoPago) {
      case "Contraentrega":
        return "Contraentrega 💵";
      case "Tarjeta":
        return "Tarjeta 💳";
      case "Stripe":
        return "Stripe 💳";
      case "Plazos":
        return "Plazos";
      default:
        return "Método de pago Desconocido";
    }
  };

  useEffect(() => {
    try {
      getNuevosClientesMes();
      getVentasStatus();
      getPedidosMetodoPago();
      getProductosMasVendidos();
      getResumenVentas();
      if (nuevosClientesMes) {
        console.log("Nuevos clientes por mes dashboard", nuevosClientesMes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const onRefresh = async () => {
    try {
      await getNuevosClientesMes();
      await getVentasStatus();
      await getPedidosMetodoPago();
      await getProductosMasVendidos();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const navigateToReporte = (param) => {
    navigate(`/reporte-ventas?param=${param}`);
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 surface-ground">
      <div className="text-2xl font-bold mb-4">Dashboard</div>
      <div className="grid grid-nogutter">
        <div className="col-12 md:col-6 lg:col-4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-lg font-bold mb-2">Nuevos Clientes por Mes</div>
            {nuevosClientesMes?.length === 0 && (
              <div className="text-center">No hay datos para mostrar</div>
            )}
            {nuevosClientesMes && (
              <Line
                data={graphDataClientes(nuevosClientesMes)}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="col-12 md:col-6 lg:col-4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-lg font-bold mb-2">Ventas por status</div>
            {ventasStatus?.length === 0 && (
              <div className="text-center">No hay datos para mostrar</div>
            )}
            {ventasStatus && (
              <Bar
                data={graphDataVentasStatus(ventasStatus)}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="col-12 md:col-6 lg:col-4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-lg font-bold mb-2">Pedidos por Método de Pago</div>
            {pedidosMetodoPago?.length === 0 && (
              <div className="text-center">No hay datos para mostrar</div>
            )}
            {pedidosMetodoPago && (
              <Bar
                data={graphData(
                    "Pedidos por método de pago",
                  pedidosMetodoPago.map((v) => obtenerMetodoPago(v.metodoPago)),
                  pedidosMetodoPago.map((v) => v.cantidad)
                )}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="col-12 md:col-6 lg:col-4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-lg font-bold mb-2">Productos Más Vendidos</div>
            {productosMasVendidos?.length === 0 && (
              <div className="text-center">No hay datos para mostrar</div>
            )}
            {productosMasVendidos && (
              <Bar
                data={graphData(
                    "Producto mas vendidos",
                  productosMasVendidos.map((v) => v.producto),
                  productosMasVendidos.map((v) => v.cantidadVendida)
                )}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="col-12 md:col-6 lg:col-4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-lg font-bold mb-2">Monto de pedidos realizados</div>
            {resumenVentas === null && (
              <div className="text-center">No hay datos para mostrar</div>
            )}
            {resumenVentas && (
              <Bar
                data={graphData(
                    "Monto de pedidos realizados",
                  ["Semana", "Mes", "Año"],
                  [resumenVentas.semana, resumenVentas.mes, resumenVentas.anio]
                )}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                  onClick: () => navigateToReporte('semana'),
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Button label="Refresh" icon="pi pi-refresh" onClick={onRefresh} />
    </div>
  );
};

export default Dashboard;