import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { ProgressSpinner } from "primereact/progressspinner";
import useNotificaciones from "../hooks/useNotificaciones";
import { Notificacion } from "../models/Notificacion";
import { InputSwitch } from "primereact/inputswitch";

import "../css/notification.css";

const Notificaciones = () => {
  const { notificaciones, cargando, getNotificaciones, marcarVisto } =
    useNotificaciones();
  const [orden, setOrden] = useState(false); // Orden ascendente/descendente
  const [criterio, setCriterio] = useState(""); // Búsqueda
  const [mostrarLeidas, setMostrarLeidas] = useState(false); // Mostrar leídas o no

  useEffect(() => {
    getNotificaciones();
  }, []);

  const procesarNotificaciones = () => {
    if (!Array.isArray(notificaciones)) {
      return [];
    }

    const filtradas = notificaciones.filter((notificacion: Notificacion) => {
      // Filtra por el estado de 'visto' basado en 'mostrarLeidas'
      const filtradaPorLeida = mostrarLeidas
        ? notificacion.visto
        : !notificacion.visto;

      // Filtra por el criterio de búsqueda
      return (
        filtradaPorLeida &&
        notificacion.mensaje.toLowerCase().includes(criterio.toLowerCase())
      );
    });

    return filtradas.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return orden ? fechaB - fechaA : fechaA - fechaB;
    });
  };

  const obtenerColorTipo = (tipo: number) => {
    const colores = [
      "#FF5733", // Rojo cálido
      "#33FF57", // Verde brillante
      "#3357FF", // Azul
      "#FFD700", // Dorado
      "#FF33A8", // Rosa brillante
      "#800080", // Púrpura oscuro
      "#008080", // Turquesa
      "#FFA500", // Naranja
      "#00FF00", // Verde neón
      "#1E90FF", // Azul Dodger
      "#DC143C", // Carmesí
      "#FF1493", // Rosa fuerte
      "#00CED1", // Turquesa oscuro
      "#4B0082", // Índigo
      "#FF4500", // Rojo anaranjado
      "#7FFF00", // Verde claro
      "#9400D3", // Púrpura
      "#FFDAB9", // Melocotón
      "#4682B4", // Azul acero
      "#DAA520", // Oro viejo
    ];
    return colores[tipo % colores.length];
  };

  return (
    <div
      className="p-4"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        className="p-field"
        style={{
          display: "flex",
          alignItems: "center", // Alinea verticalmente
          justifyContent: "space-between", // Espaciado entre elementos
          width: "80%",
          gap: "10px",
          marginBottom: "20px",
          minWidth: "300px",
        }}
      >
        {/* Input que se ajusta al tamaño del padre */}
        <InputText
          placeholder="Buscar por mensaje..."
          value={criterio}
          onChange={(e) => setCriterio(e.target.value)}
          className="p-inputtext-lg inputText"
          style={{
            flex: 1, // Ocupa el espacio restante
            marginRight: "10px",
          }}
        />

        {/* Botón de orden ascendente/descendente */}
        <ToggleButton
          checked={orden}
          onChange={(e) => setOrden(e.value)}
          onLabel="Descendente"
          offLabel="Ascendente"
          className="p-button-lg toggleButton"
          style={{
            marginRight: "10px",
          }}
        />

        {/* Switch para mostrar leídas */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <InputSwitch
            className="inputSwitch"
            checked={mostrarLeidas} // Controla el estado
            onChange={(e) => setMostrarLeidas(e.value)} // Actualiza el estado
            style={{ marginRight: "5px" }}
          />
          <label htmlFor="mostrarLeidas">Mostrar leídas</label>
        </div>
      </div>

      {cargando ? (
        <ProgressSpinner />
      ) : notificaciones && notificaciones.length > 0 ? (
        <div
          className="p-grid"
          style={{
            width: "80%",
            minWidth: "300px",
            justifyContent: "center",
          }}
        >
          {procesarNotificaciones().map((notificacion: Notificacion) => (
            <div
              className="p-col-12"
              key={notificacion.id}
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                className={`p-card ${
                  notificacion.visto ? "" : "notificacion-no-leida"
                }`}
                style={{
                  width: "100%",
                  minWidth: "300px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  backgroundColor: notificacion.visto ? "#ffffff" : "#ffe7d6", // Fondo diferente
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                {/* Círculo de color basado en el tipo */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    margin: "0 10px",
                    backgroundColor: obtenerColorTipo(notificacion.tipo),
                  }}
                ></div>

                {/* Contenido */}
                <div style={{ flex: 1 }}>
                  <h4>{notificacion.mensaje}</h4>
                  <p>{new Date(notificacion.fecha).toLocaleString()}</p>
                </div>

                {/* Botón de marcar como visto */}
                {!notificacion.visto && (
                  <Button
                    className="p-button-rounded p-button-success p-button-sm"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    onClick={() => marcarVisto(notificacion.id)}
                  >
                    {" "}
                    <i className="pi pi-check" /> Marcar como leído
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay notificaciones</p>
      )}
    </div>
  );
};

export default Notificaciones;
