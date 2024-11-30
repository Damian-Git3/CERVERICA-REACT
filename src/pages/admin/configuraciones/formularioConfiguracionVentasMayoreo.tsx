import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConfiguracionVentasMayoreo from "../../../hooks/useConfiguracionVentasMayoreo";
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext'; // PrimeReact InputText
import { Button } from 'primereact/button'; // PrimeReact Button

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string>("");

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
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "pagosMensuales" ? value : value || 0, // Asegura que los campos numéricos se manejen correctamente
    }));
  };

  const formatFechaModificacion = (fecha: Date) => {
    return fecha.toISOString();
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      toast.error("Por favor corrige los errores antes de continuar.");
      return;
    }

    const fechaSolicitud = new Date();
    const year = fechaSolicitud.getFullYear();
    const month = String(fechaSolicitud.getMonth() + 1).padStart(2, "0");
    const day = String(fechaSolicitud.getDate()).padStart(2, "0");
    const hours = String(fechaSolicitud.getHours()).padStart(2, "0");
    const minutes = String(fechaSolicitud.getMinutes()).padStart(2, "0");
    const seconds = String(fechaSolicitud.getSeconds()).padStart(2, "0");
    const milliseconds = String(fechaSolicitud.getMilliseconds()).padStart(3, "0");

    const fechaFormatoAPI = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

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

  const validateForm = () => {
    let formErrors: { [key: string]: string } = {};
    if (formValues.plazoMaximoPago <= 0) formErrors.plazoMaximoPago = "Plazo máximo de pago debe ser mayor a 0";
    if (formValues.montoMinimoMayorista <= 0) formErrors.montoMinimoMayorista = "Monto mínimo mayorista debe ser mayor a 0";
    return formErrors;
  };

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>, name: string) => {
    // Filtra solo los números
    const value = e.currentTarget.value.replace(/[^0-9]/g, '');
    handleChange(name, value);
  };

  return (
    <div className="container">
      <h1>{configuracion ? "Actualizar" : "Registrar"} Configuración de Ventas Mayoreo</h1>

      <div className="p-field p-grid w-50">
        <label htmlFor="plazoMaximoPago" className="p-col-12 p-md-2">Plazo Máximo de Pago:</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            id="plazoMaximoPago"
            value={formValues.plazoMaximoPago}
            onInput={(e) => handleInputChange(e, "plazoMaximoPago")}
          />
          {formValues.plazoMaximoPago <= 0 && (
            <span className="p-error">El plazo máximo de pago debe ser mayor que 0</span>
          )}
        </div>
      </div>

      <div className="p-field p-grid w-50" style={{ width: '50%' }}>
        <label htmlFor="pagosMensuales" className="p-col-12 p-md-2">Pagos Mensuales:</label>
        <div className="p-col-12 p-md-10">
          <InputSwitch
            id="pagosMensuales"
            checked={formValues.pagosMensuales}
            onChange={(e) => handleChange('pagosMensuales', e.value)}
          />
        </div>
      </div>

      <div className="p-field p-grid w-50">
        <label htmlFor="montoMinimoMayorista" className="p-col-12 p-md-2">Monto Mínimo Mayorista:</label>
        <div className="p-col-12 p-md-10">
          <InputText
            style={{ width: '100%' }}
            className="w-100"
            id="montoMinimoMayorista"
            value={formValues.montoMinimoMayorista}
            onInput={(e) => handleInputChange(e, "montoMinimoMayorista")}
          />
          {formValues.montoMinimoMayorista <= 0 && (
            <span className="p-error">El monto mínimo mayorista debe ser mayor que 0</span>
          )}
        </div>
      </div>

      <br />

      <Button label={configuracion ? "Actualizar" : "Registrar"} onClick={handleSubmit} className="p-button-primary" />

      <ToastContainer />
    </div>
  );
};

export default FormularioConfiguracionVentasMayoreo;
