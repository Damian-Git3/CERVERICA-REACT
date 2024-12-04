import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import usePagos from "../../../hooks/usePagos"; 
import { useNavigate } from "react-router-dom";
import "./mayoristas-asignados.css";

const MayoristasAsignados = () => {
  const { mayoristasAsignados, getMayoristasAsignados, cargando } = usePagos();
  const [searchText, setSearchText] = useState("");
  const [filteredMayoristas, setFilteredMayoristas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMayoristasAsignados();
  }, []);

  useEffect(() => {
    filterSolicitudes();
  }, [searchText, mayoristasAsignados]);

  const filterSolicitudes = () => {
    if (!mayoristasAsignados) return;
    const filtered = mayoristasAsignados.filter(
      (mayorista) =>
        mayorista.nombreEmpresa
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        mayorista.rfcEmpresa.toLowerCase().includes(searchText.toLowerCase()) ||
        mayorista.nombreContacto
          .toLowerCase()
          .includes(searchText.toLowerCase())
    );
    setFilteredMayoristas(filtered);
  };

  const handleMayoristaClick = (id) => {
    navigate(`/mayorista/${id}/pagos`);
  };

  return (
    <div className="container">
      <h2 className="title">Clientes Mayoristas Asignados</h2>
      <InputText
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Buscar por nombre, RFC o contacto"
        className="search-input"
      />
      <div className="container-cards">
        {filteredMayoristas.length > 0 ? (
          filteredMayoristas.map((item) => (
            <Card
              key={item.id}
              title={item.nombreEmpresa}
              subTitle={`RFC: ${item.rfcEmpresa}`}
              className="card"
            >
              <p>Contacto: {item.nombreContacto}</p>
              <p>Teléfono: {item.telefonoEmpresa}</p>
              <p>Email: {item.emailEmpresa}</p>
              <Button
                label="Ver Detalles"
                onClick={() => handleMayoristaClick(item.id)}
                className="p-button-outlined p-button-info"
              />
            </Card>
          ))
        ) : (
          !cargando && <p>No se encontraron clientes mayoristas</p>
        )}
      </div>
    </div>
  );
};

export default MayoristasAsignados;
