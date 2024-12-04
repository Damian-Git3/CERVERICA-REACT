import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import useHistorialPrecios from "../../../hooks/useHistorialPrecios";
import ModalReceta from "../ModalReceta";

import { Card } from "primereact/card";

import "./styles.css";

export const HistorialPrecios = () => {
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [idReceta, setIdReceta] = useState<number | undefined>();
  const [filteredRecetas, setFilteredRecetas] = useState<any[]>([]);
  const { listaRecetas, getListaRecetas } = useHistorialPrecios();

  const loadData = async () => {
    await getListaRecetas();
  };

  useEffect(() => {
    loadData();
    setReload(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (reload === true) {
        await getListaRecetas();
        setReload(false);
      }
    };
    fetchData();
  }, [getListaRecetas, reload]);

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

  const header = (
    <div className="text-center uppercase py-4">
      <span className="text-orange-500 font-bold text-6xl">Historial de precios</span>
    </div>
  );

  const headerTablePrecios = (
    <div className="flex align-items-center justify-content-between">
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          loadData();
        }}
        rounded
        raised
      />
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          value={text}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar"
        />
      </IconField>
    </div>
  );

  return (
    <Card header={header}>
      <div className="p-d-flex p-flex-column p-ai-center">
        <div className="p-mt-4" style={{ width: "100%" }}>
          <DataTable
            dataKey="id"
            sortField="id"
            sortOrder={1}
            removableSort
            sortMode="multiple"
            value={filteredRecetas}
            header={headerTablePrecios}
            paginator
            rows={10}
            size="normal"
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No hay registros"
            globalFilterFields={["id", "nombre", "precio", "activo"]}
            selectionMode={"single"}
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
                <Button icon="pi pi-eye" onClick={() => handleItemPress(rowData.id)} />
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
    </Card>
  );
};
