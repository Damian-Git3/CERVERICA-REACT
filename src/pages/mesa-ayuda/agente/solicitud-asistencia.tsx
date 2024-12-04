import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import useSolicitudesAsistencias from "../../../hooks/useSolicitudesAsistencias";
import "../../../css/solicitud-asistencia-cliente.css";
import { useNavigate } from "react-router";
import "primereact/resources/themes/saga-orange/theme.css";

const SolicitudAsistenciaAgente = () => {
  const { solicitudesAsistenciasAgente, getSolicitudesAsistenciasAgente } =
    useSolicitudesAsistencias();
  const [showActive, setShowActive] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);

  useEffect(() => {
    getSolicitudesAsistenciasAgente(showActive);
  }, [showActive]);

  useEffect(() => {
    filterSolicitudes(searchText);
  }, [searchText, solicitudesAsistenciasAgente]);

  const navigate = useNavigate();

  const filterSolicitudes = (text) => {
    if (!text) {
      setFilteredSolicitudes(solicitudesAsistenciasAgente);
    } else {
      const filtered = solicitudesAsistenciasAgente.filter(
        (item) =>
          item.emailCliente.toLowerCase().includes(text.toLowerCase()) ||
          item.descripcion.toLowerCase().includes(text.toLowerCase()) ||
          item.nombreCliente.toLowerCase().includes(text.toLowerCase()) ||
          item.fechaSolicitud.toLowerCase().includes(text.toLowerCase()) ||
          item.nombreCategoria.toLowerCase().includes(text.toLowerCase()) ||
          item.numeroCliente.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSolicitudes(filtered);
    }
  };

  const renderItem = (item) => (
    <div className="card-solicitud" key={item.id}>
      <Card>
        <h3>{item.nombreCategoria}</h3>
        <p>
          <strong>Descripción:</strong> {item.descripcion}
        </p>
        <p>
          <strong>Fecha de Solicitud:</strong>{" "}
          {new Date(item.fechaSolicitud).toLocaleString()}
        </p>
        <p>
          <strong>Cliente:</strong> {item.nombreCliente} ({item.emailCliente})
        </p>
        <p>
          <strong>Estatus:</strong>{" "}
          {item.estatus === 1
            ? "Enviado"
            : item.estatus === 3
            ? "Cerrado"
            : "Seguimiento"}
        </p>
        {item.estatus === 3 ? (
          <>
            <p>
              <strong>Fecha de Cierre:</strong>{" "}
              {new Date(item.fechaCierre).toLocaleString()}
            </p>
          </>
        ) : (
          <></>
        )}
        <Button
          label="Detalles"
          onClick={() => navigate(`/agente/solicitud-asistencia/${item.id}`)}
        ></Button>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: "20px" }} className=" bg-card-light">
      <div style={{ margin: "20px 0" }}>
        <h2>Solicitudes de Asistencia</h2>
        <div style={{ marginBottom: "10px" }}>
          <ToggleButton
            checked={showActive}
            onChange={() => setShowActive(!showActive)}
            onLabel="Activas"
            offLabel="Históricas"
          />
        </div>

        <InputText
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar solicitud..."
          style={{ width: "100%", marginBottom: "20px" }}
        />
      </div>

      {filteredSolicitudes != null && filteredSolicitudes.length > 0 ? (
        <div className="container-cards">{filteredSolicitudes.map(renderItem)}</div>
      ) : (
        <p>No hay solicitudes de asistencia</p>
      )}
    </div>
  );
};

export default SolicitudAsistenciaAgente;
