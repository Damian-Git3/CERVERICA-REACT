import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConfiguracionVentasMayoreo from "../../../hooks/useConfiguracionVentasMayoreo";
import { Switch } from "antd"; // Importa Switch de Ant Design
import "./FormularioConfiguracionVentasMayoreo.css"; // Importar el archivo CSS

interface IConfiguracionVentasMayoreo {
  id: number;
  plazoMaximoPago: number;
  pagosMensuales: boolean;
  montoMinimoMayorista: number;
  fechaModificacion: Date;
}

const FormularioConfiguracionVentasMayoreo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const configuracion = location.state?.configuracionVentasMayoreo || null;
  
  const {
    registrarConfiguracionVentasMayoreo,
    actualizarConfiguracionVentasMayoreo,
  } = useConfiguracionVentasMayoreo();

  const [formValues, setFormValues] = useState<IConfiguracionVentasMayoreo>({
    id: configuracion?.id || 0,
    plazoMaximoPago: configuracion?.plazoMaximoPago || 0,
    pagosMensuales: configuracion?.pagosMensuales || false,
    montoMinimoMayorista: configuracion?.montoMinimoMayorista || 0,
    fechaModificacion: new Date(),
  });

  useEffect(() => {
    if (configuracion) {
      setFormValues({
        id: configuracion.id,
        plazoMaximoPago: configuracion.plazoMaximoPago,
        pagosMensuales: configuracion.pagosMensuales,
        montoMinimoMayorista: configuracion.montoMinimoMayorista,
        fechaModificacion: new Date(configuracion.fechaModificacion),
      });
    }
  }, [configuracion]);

  const handleChange = (name: string, value: any) => {
    // Asegúrate de que el valor sea numérico o 0 en caso de vacío
    const numericValue = value === "" ? 0 : parseFloat(value);
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "pagosMensuales" ? value : numericValue,
    }));
  };

  const formatFechaModificacion = (fecha: Date) => {
    return fecha.toISOString();
  };

  const handleSubmit = async () => {
    const fechaFormatoAPI = formatFechaModificacion(new Date());

    const dataToSend = {
      ...formValues,
      fechaModificacion: fechaFormatoAPI,
    };

    try {
      if (formValues.id) {
        await actualizarConfiguracionVentasMayoreo(dataToSend);
        toast.success("Configuración actualizada con éxito.");
      } else {
        await registrarConfiguracionVentasMayoreo(dataToSend);
        toast.success("Configuración registrada con éxito.");
      }
      navigate(-1); 
    } catch (error) {
      console.error("Error al registrar o actualizar:", error);
      toast.error("Hubo un problema al procesar la solicitud.");
    }
  };

  // Función para manejar la validación de los inputs
  const handleKeyPress = (e: React.KeyboardEvent) => {
    const key = e.key;
    // Solo permitir teclas numéricas y otras teclas (como backspace y enter)
    if (!/[0-9]/.test(key) && key !== "Backspace" && key !== "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        {configuracion ? "Actualizar" : "Registrar"} Configuración de Ventas
        Mayoreo
      </h1>

      <div className="form-group">
        <label className="label">Plazo Máximo de Pago:</label>
        <input
          className="input"
          type="text"
          value={formValues.plazoMaximoPago}
          onChange={(e) => handleChange("plazoMaximoPago", e.target.value)}
          onKeyDown={handleKeyPress} // Limitar a números
        />
        {formValues.plazoMaximoPago <= 0 && (
          <span className="error">El plazo máximo de pago debe ser mayor que 0</span>
        )}
      </div>

      <div className="form-group">
        <label className="label">Pagos Mensuales:</label>
        <Switch
          checked={formValues.pagosMensuales}
          onChange={(checked) => handleChange("pagosMensuales", checked)}
        />
      </div>

      <div className="form-group">
        <label className="label">Monto Mínimo Mayorista:</label>
        <input
          className="input"
          type="text"
          value={formValues.montoMinimoMayorista}
          onChange={(e) => handleChange("montoMinimoMayorista", e.target.value)}
          onKeyDown={handleKeyPress} // Limitar a números
        />
        {formValues.montoMinimoMayorista <= 0 && (
          <span className="error">El monto mínimo mayorista debe ser mayor que 0</span>
        )}
      </div>

      <button className="button" onClick={handleSubmit}>
        {configuracion ? "Actualizar" : "Registrar"} Configuración
      </button>

      <ToastContainer />
    </div>
  );
};

export default FormularioConfiguracionVentasMayoreo;
