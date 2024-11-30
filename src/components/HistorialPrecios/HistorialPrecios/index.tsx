import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import useHistorialPrecios from "../../../hooks/useHistorialPrecios";
import ModalReceta from "../ModalReceta";
import "./styles.css";

export function HistorialPrecios() {
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [idReceta, setIdReceta] = useState<number | undefined>();
  const [filteredRecetas, setFilteredRecetas] = useState<any[]>([]);
  const { listaRecetas, getListaRecetas } = useHistorialPrecios();

  useEffect(() => {
    console.log("reload", reload);
    if (reload === false) {
      getListaRecetas();
    }
  }, [reload]);

  useEffect(() => {
    setFilteredRecetas(listaRecetas);
  }, [listaRecetas]);

  const handleSearch = (text: any) => {
    setText(text);
    if (text) {
      const filtered = listaRecetas.filter((receta: any) =>
        receta.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRecetas(filtered);
    } else {
      setFilteredRecetas(listaRecetas);
    }
  };

  const handleItemPress = (id: number) => {
    setIdReceta(id);
    setModalVisible(true);
  };

  return (
    <div className="p-d-flex p-flex-column p-ai-center">
      <h1>Precios</h1>
      <div className="p-inputgroup">
        <InputText
          value={text}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar"
        />
        <Button icon="pi pi-search" />
      </div>
      <div className="p-mt-4" style={{ width: "100%" }}>
        <DataTable
          value={filteredRecetas}
          paginator
          rows={10}
          size="small"
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="id" header="ID" sortable />
          <Column field="nombre" header="Nombre" sortable />
          <Column
            field="precio"
            header="Precio"
            sortable
            body={(rowData) => `$${rowData.precio.toFixed(2)}`}
          />
          <Column
            field="activo"
            header="Estado"
            body={(rowData) => (
              <Tag
                severity={rowData.activo ? "success" : "danger"}
                value={rowData.activo ? "Activo" : "Inactivo"}
              ></Tag>
            )}
            sortable
          />
          <Column
            body={(rowData) => (
              <Button
                icon="pi pi-eye"
                onClick={() => handleItemPress(rowData.id)}
              />
            )}
          />
        </DataTable>
      </div>
      {idReceta !== undefined && idReceta !== null && (
        <ModalReceta
          modalVisible={modalVisible}
          idReceta={idReceta}
          setReload={setReload}
          setModalVisible={setModalVisible}
        />
      )}
    </div>
  );
}
