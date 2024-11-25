import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Usamos React Router para navegación
import { ToastContainer, toast } from "react-toastify"; // Usamos react-toastify para los mensajes
import "react-toastify/dist/ReactToastify.css"; // Importamos los estilos de react-toastify
import DatePicker from "react-datepicker"; // Usamos react-datepicker para el selector de fechas
import "react-datepicker/dist/react-datepicker.css"; // Estilo para el selector de fecha
import { Select } from "antd"; // Usamos Ant Design para los selectores (como Picker en React Native)
import { InputNumber, Switch, Button, Input } from "antd"; // Usamos Ant Design para otros componentes
import useCupones from "../../../hooks/useCupones";

const { Option } = Select;

interface Cupon {
  id: number;
  codigo: string;
  fechaCreacion: string;
  fechaExpiracion: string;
  tipo: number;
  paquete: number;
  cantidad: number;
  valor: number;
  usos: number;
  montoMaximo: number;
  categoriaComprador: number;
  activo: boolean;
}

const FormularioCupones: React.FC = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const cupon = location.state ? location.state.cupon : null;

  const {
    registrarCupon,
    actualizarCupon,
  } = useCupones();

  const [formValues, setFormValues] = useState<Cupon>({
    id: cupon?.id || 0,
    codigo: cupon?.codigo || "",
    fechaCreacion: cupon?.fechaCreacion || new Date().toISOString(),
    fechaExpiracion: cupon?.fechaExpiracion || "",
    tipo: cupon?.tipo || 0,
    paquete: cupon?.paquete || 0,
    cantidad: cupon?.cantidad || 0,
    valor: cupon?.valor || 0,
    usos: cupon?.usos || 0,
    montoMaximo: cupon?.montoMaximo || 0,
    categoriaComprador: cupon?.categoriaComprador || 1,
    activo: cupon?.activo || true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (formValues.tipo === 1 && formValues.valor > 100) {
        toast.error("El valor del cupón no puede ser mayor que 100%.");
        return;
      }

      const fecha = new Date();
      const fechaFormatoAPI = fecha.toISOString();

      const formValuesConFecha = cupon
        ? {
          ...formValues,
        }
        : {
          ...formValues,
          fechaCreacion: fechaFormatoAPI,
        };

      if (cupon) {
        await actualizarCupon(formValuesConFecha.id, formValuesConFecha);
        toast.success("Cupón Actualizado: El cupón ha sido actualizado exitosamente.");
      } else {
        await registrarCupon(formValuesConFecha);
        toast.success("Cupón Registrado: El cupón ha sido registrado exitosamente.");
      }

      navigation(-1); // Vuelve a la página anterior
    } catch (error) {
      console.error("Error al registrar o actualizar el cupón:", error);
      toast.error("Error: Hubo un problema al procesar la solicitud.");
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "Seleccionar fecha";
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="container">
      <h1 className="title">{cupon ? "Actualizar" : "Registrar"} Cupón</h1>

      <div className="form-group">
        <label>Código del Cupón:</label>
        <Input
          className="input"
          value={formValues.codigo}
          onChange={(e) => handleChange("codigo", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Fecha de Expiración:</label>
        <DatePicker
          className="input"
          selected={formValues.fechaExpiracion ? new Date(formValues.fechaExpiracion) : null}
          onChange={(date) => handleChange("fechaExpiracion", date?.toISOString() || "")}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className="form-group">
        <label>Tipo de Cupón:</label>
        <Select
          value={formValues.tipo}
          onChange={(value) => handleChange("tipo", value)}
          style={{ width: "100%" }}
        >
          <Option value={1}>Porcentaje</Option>
          <Option value={2}>Fijo</Option>
        </Select>
      </div>

      <div className="form-group">
        <label>Paquete:</label>
        <InputNumber
          className="input"
          value={formValues.paquete}
          onKeyPress={handleKeyPress}
          onChange={(value) => handleChange("paquete", value || 0)}
        />
      </div>

      <div className="form-group">
        <label>Cantidad:</label>
        <InputNumber
          className="input"
          value={formValues.cantidad}
          onKeyPress={handleKeyPress}
          onChange={(value) => handleChange("cantidad", value || 0)}
        />
      </div>

      <div className="form-group">
        <label>Valor:</label>
        <InputNumber
          className="input"
          value={formValues.valor}
          onKeyPress={handleKeyPress}
          onChange={(value) => handleChange("valor", value || 0)}
        />
      </div>

      <div className="form-group">
        <label>Usos:</label>
        <InputNumber
          className="input"
          value={formValues.usos}
          onKeyPress={handleKeyPress}
          onChange={(value) => handleChange("usos", value || 0)}
        />
      </div>

      <div className="form-group">
        <label>Monto Máximo:</label>
        <InputNumber
          className="input"
          value={formValues.montoMaximo}
          onKeyPress={handleKeyPress}
          onChange={(value) => handleChange("montoMaximo", value || 0)}
        />
      </div>

      <div className="form-group">
        <label>Categoría de Comprador:</label>
        <Select
          value={formValues.categoriaComprador}
          onChange={(value) => handleChange("categoriaComprador", value)}
          style={{ width: "100%" }}
        >
          <Option value={1}>Todos</Option>
          <Option value={2}>Frecuente</Option>
          <Option value={3}>Minorista</Option>
          <Option value={4}>Mayorista</Option>
          <Option value={5}>Inactivo</Option>
        </Select>
      </div>

      <div className="form-group">
        <label>Activo:</label>
        <Switch
          checked={formValues.activo}
          onChange={(checked) => handleChange("activo", checked)}
        />
      </div>

      <Button type="primary" onClick={handleSubmit}>
        {cupon ? "Actualizar" : "Registrar"} Cupón
      </Button>

      <ToastContainer />
    </div>
  );
};

export default FormularioCupones;
