import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import useSolicitudesAsistencias from "../../../hooks/useSolicitudesAsistencias";
import { ToastContext } from "../../../App";


const NuevaSolicitudAsistenciaModal = ({ recargar }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const {
    categoriasAsistencias,
    getCategoriasAsistencias,
    crearSolicitudAsistencia,
  } = useSolicitudesAsistencias();


  const { showToast } = useContext(ToastContext);

  const formValido = categoriaSeleccionada && descripcion.trim().length > 0;

  useEffect(() => {
    const fetchCategorias = async () => {
      await getCategoriasAsistencias();
      console.log(categoriasAsistencias);
    };
    fetchCategorias();
  }, []);


  const handleEnviarSolicitud = async () => {
    if (formValido) {
      const nuevaSolicitud = {
        idCategoriaAsistencia: categoriaSeleccionada.id,
        descripcion: descripcion.trim(),
        tipo: 0, // Puedes ajustar este valor según sea necesario
      };

      const response = { status: 200 }; // simulacion de respuestaT
      //const response = await crearSolicitudAsistencia(nuevaSolicitud);
      console.log(response.status);
      if (response?.status === 200) {
        showToast({
          severity: "success",
          summary: "Éxito!",
          detail: "Se ha enviado tu solicitud de asistencia correctamente.",
        });

        setModalVisible(false);
        setCategoriaSeleccionada(null);
        setDescripcion("");
        recargar(true);
      } else {
        showToast({ detail: "Error al enviar la solicitud." });
      }
    } else {
      showToast({ detail: "Por favor, completa todos los campos." });
    }
  };

  const modalFooter = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setModalVisible(false)}
      />
      <Button
        label="Enviar"
        icon="pi pi-check"
        onClick={handleEnviarSolicitud}
        disabled={!formValido}
      />
    </div>
  );

  return (
    <div>
      {/* Botón para abrir el modal */}
      <Button
        label="Nueva solicitud de asistencia"
        icon="pi pi-plus"
        onClick={() => setModalVisible(true)}
      />

      {/* Modal con el formulario */}
      <Dialog
        header="Nueva Solicitud de Asistencia"
        visible={modalVisible}
        style={{ width: "50vw" }}
        footer={modalFooter}
        onHide={() => setModalVisible(false)}
      >
        <div className="field">
          <label htmlFor="categoria" className="block font-medium mb-2">
            Categoría de Asistencia
          </label>
          <Dropdown
            id="categoria"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.value)}
            options={categoriasAsistencias}
            optionLabel="nombre" // Asegúrate de que "nombre" sea la propiedad correcta
            placeholder="Selecciona una categoría"
            className="w-full"
          />
        </div>

        <div className="field mt-4">
          <label htmlFor="descripcion" className="block font-medium mb-2">
            Descripción
          </label>
          <InputTextarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            cols={30}
            placeholder="Describe tu solicitud"
            className="w-full"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default NuevaSolicitudAsistenciaModal;
