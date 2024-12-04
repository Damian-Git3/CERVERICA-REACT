import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import useCupones from "../../../hooks/useCupones";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

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
  montoMaximo?: number;
  montoMinimo?: number;
  categoriaComprador: number;
  activo: boolean;
}

const FormularioCupones: React.FC = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const cupon = location.state ? location.state.cupon : null;

  const { registrarCupon, actualizarCupon } = useCupones();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Cupon>({
    defaultValues: {
      id: cupon?.id || 0,
      codigo: cupon?.codigo || "",
      fechaCreacion: cupon?.fechaCreacion || new Date().toISOString(),
      fechaExpiracion: cupon?.fechaExpiracion || "",
      tipo: cupon?.tipo || 2,
      paquete: 0,
      cantidad: cupon?.cantidad || 0,
      valor: cupon?.valor || 0,
      usos: cupon?.usos || 0,
      montoMaximo: 0,
      montoMinimo: cupon?.montoMinimo || 0,
      activo: cupon?.activo || true,
    },
  });

  const tipoCupon = watch("tipo");

  const onSubmit = async (data: Cupon) => {
    try {
      if (data.tipo === 1 && data.valor > 100) {
        toast.error("El valor del cupón no puede ser mayor que 100%.");
        return;
      }

      const fechaFormatoAPI = new Date().toISOString();

      const formValuesConFecha = cupon
        ? { ...data }
        : { ...data, fechaCreacion: fechaFormatoAPI };

      if (cupon) {
        await actualizarCupon(formValuesConFecha.id, formValuesConFecha);
        toast.success(
          "Cupón Actualizado: El cupón ha sido actualizado exitosamente."
        );
      } else {
        await registrarCupon(formValuesConFecha);
        toast.success(
          "Cupón Registrado: El cupón ha sido registrado exitosamente."
        );
      }

      navigation(-1);
    } catch (error) {
      console.error("Error al registrar o actualizar el cupón:", error);
      toast.error("Error: Hubo un problema al procesar la solicitud.");
    }
  };

  const opcionesTipoCupon = [
    { label: "Porcentaje", value: 1 },
    { label: "Fijo", value: 2 },
  ];

  return (
    <div className="container">
      <h1 className="title">{cupon ? "Actualizar" : "Registrar"} Cupón</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label>Código del Cupón:</label>
          <Controller
            name="codigo"
            control={control}
            rules={{ required: "El código del cupón es obligatorio" }}
            render={({ field }) => (
              <>
                <InputText
                  {...field}
                  className={`w-full ${errors.codigo ? "p-invalid" : ""}`}
                />
                {errors.codigo && (
                  <small className="p-error">{errors.codigo.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Fecha de Expiración:</label>
          <Controller
            name="fechaExpiracion"
            control={control}
            rules={{ required: "La fecha de expiración es obligatoria" }}
            render={({ field }) => (
              <>
                <Calendar
                  {...field}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(e) =>
                    setValue("fechaExpiracion", e.value?.toISOString() || "")
                  }
                  className={`w-full ${
                    errors.fechaExpiracion ? "p-invalid" : ""
                  }`}
                  dateFormat="dd/mm/yy"
                  placeholder="Selecciona una fecha"
                />
                {errors.fechaExpiracion && (
                  <small className="p-error">
                    {errors.fechaExpiracion.message}
                  </small>
                )}
              </>
            )}
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Tipo de Cupón:</label>
          <Controller
            name="tipo"
            control={control}
            rules={{ required: "Debe seleccionar un tipo de cupón" }}
            render={({ field }) => (
              <>
                <Dropdown
                  {...field}
                  options={opcionesTipoCupon}
                  className={`w-full ${errors.tipo ? "p-invalid" : ""}`}
                  placeholder="Selecciona el tipo de cupón"
                />
                {errors.tipo && (
                  <small className="p-error">{errors.tipo.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Cantidad cupones:</label>
          <Controller
            name="cantidad"
            control={control}
            rules={{
              required: "La cantidad es obligatoria",
              min: { value: 1, message: "La cantidad debe ser mayor a 0" },
            }}
            render={({ field }) => (
              <>
                <InputNumber
                  {...field}
                  className={`w-full ${errors.cantidad ? "p-invalid" : ""}`}
                  onChange={(e) => setValue("cantidad", e.value || 0)}
                />
                {errors.cantidad && (
                  <small className="p-error">{errors.cantidad.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Descuento {tipoCupon === 1 ? "(%)" : "($)"}:</label>
          <Controller
            name="valor"
            control={control}
            rules={{
              required: "El valor es obligatorio",
              min: { value: 1, message: "El valor debe ser mayor a 0" },
              ...(tipoCupon === 1 && {
                max: {
                  value: 100,
                  message: "El porcentaje no puede ser mayor a 100",
                },
              }),
            }}
            render={({ field }) => (
              <>
                {tipoCupon === 1 ? (
                  <InputNumber
                    {...field}
                    className={`w-full ${errors.valor ? "p-invalid" : ""}`}
                    onChange={(e) => setValue("valor", e.value || 0)}
                    mode="decimal"
                    min={1}
                    max={100}
                    suffix="%"
                  />
                ) : (
                  <InputNumber
                    {...field}
                    className={`w-full ${errors.valor ? "p-invalid" : ""}`}
                    onChange={(e) => setValue("valor", e.value || 0)}
                    mode="currency"
                    currency="MXN"
                    locale="es-MX"
                  />
                )}
                {errors.valor && (
                  <small className="p-error">{errors.valor.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Monto Mínimo:</label>
          <Controller
            name="montoMinimo"
            control={control}
            rules={{
              required: "El monto mínimo es obligatorio",
              min: {
                value: 1,
                message: "El monto mínimo debe ser mayor a 0",
              },
            }}
            render={({ field }) => (
              <>
                <InputNumber
                  {...field}
                  mode="currency"
                  currency="MXN"
                  locale="es-MX"
                  className={`w-full ${errors.montoMinimo ? "p-invalid" : ""}`}
                  onChange={(e) => setValue("montoMinimo", e.value || 0)}
                />
                {errors.montoMinimo && (
                  <small className="p-error">
                    {errors.montoMinimo.message}
                  </small>
                )}
              </>
            )}
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Activo:</label>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <div className="field-checkbox">
                <InputSwitch
                  checked={field.value}
                  onChange={(e) => setValue("activo", e.value)}
                />
              </div>
            )}
          />
        </div>

        <div className="col-12">
          <Button
            label={cupon ? "Actualizar" : "Registrar"}
            icon="pi pi-check"
            type="submit"
            className="p-button-primary"
          />
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default FormularioCupones;
