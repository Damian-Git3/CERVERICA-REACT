import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import useSolicitudesAsistencias from "../../../hooks/useSolicitudesAsistencias";
import NuevaSolicitudAsistenciaModal from "./nueva-solicitud-asistencia-modal";
import "../../../css/solicitud-asistencia-cliente.css";
import { useNavigate } from "react-router";
import "primereact/resources/themes/saga-orange/theme.css";

const SolicitudAsistenciaCliente = () => {
  const { solicitudesAsistenciasCliente, getSolicitudesAsistenciasCliente } =
    useSolicitudesAsistencias();
  const [showActive, setShowActive] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);

  useEffect(() => {
    getSolicitudesAsistenciasCliente(showActive);
  }, [showActive]);

  useEffect(() => {
    filterSolicitudes(searchText);
  }, [searchText, solicitudesAsistenciasCliente]);

  const navigate = useNavigate();

  const filterSolicitudes = (text) => {
    if (!text) {
      setFilteredSolicitudes(solicitudesAsistenciasCliente);
    } else {
      const filtered = solicitudesAsistenciasCliente.filter(
        (item) =>
          item.nombreCategoria.toLowerCase().includes(text.toLowerCase()) ||
          item.descripcion.toLowerCase().includes(text.toLowerCase()) ||
          item.nombreAgente.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSolicitudes(filtered);
    }
  };

  const renderItem = (item) => (
    <div className="card-container" key={item.id}>
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
          <strong>Agente:</strong> {item.nombreAgente} ({item.emailAgente})
        </p>
        <p>
          <strong>Estatus:</strong>{" "}
          {item.estatus === 1
            ? "Enviado"
            : item.estatus === 3
            ? "Cerrado"
            : "Seguimiento"}
        </p>
        <Button label="Detalles" onClick={()=>navigate(`/solicitud-asistencia/${item.id}`)}></Button>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: "20px" }} className=" bg-card-light">
      <NuevaSolicitudAsistenciaModal recargar={getSolicitudesAsistenciasCliente}/>

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
        <div className="card-list">{filteredSolicitudes.map(renderItem)}</div>
      ) : (
        <p>No hay solicitudes de asistencia</p>
      )}
    </div>
  );
};

export default SolicitudAsistenciaCliente;
