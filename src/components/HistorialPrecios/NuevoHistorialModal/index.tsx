import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useHistorialPrecios from "../../../hooks/useHistorialPrecios";

interface NuevoHistorialModalProps {
  modalVisible: boolean;
  idReceta: number;
  setReloadReceta: (reload: boolean) => void;
  setModalVisible: (visible: boolean) => void;
}

const NuevoHistorialModal: React.FC<NuevoHistorialModalProps> = ({
  modalVisible,
  idReceta,
  setReloadReceta,
  setModalVisible,
}) => {
  const defaultValues = {
    precioPaquete1: null,
    precioPaquete6: null,
    precioPaquete12: null,
    precioPaquete24: null,
    precioBaseMayoreo: null,
  };

  const {
    control,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
    getValues,
    trigger,
  } = useForm({
    defaultValues,
  });

  console.log("errors", errors);

  const { setNuevoPrecio } = useHistorialPrecios();

  const onSubmit = async () => {
    console.log("idReceta", idReceta);
    console.log(getValues());
    await trigger();

    if (isValid) {
      const data = getValues();
      const response = await setNuevoPrecio({ ...data, idReceta });
      console.log("Response", response);
      setReloadReceta(true);
      setModalVisible(false);
      reset();
    }
  };

  const precioPaquete1 = watch("precioPaquete1");

  const handleHide = () => {
    setModalVisible(false);
    reset();
  };

  useEffect(() => {
    if (precioPaquete1) {
      setValue("precioPaquete6", precioPaquete1 * 6);
      setValue("precioPaquete12", precioPaquete1 * 12);
      setValue("precioPaquete24", precioPaquete1 * 24);
    }
  }, [precioPaquete1, setValue]);

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>;
  };

  const footerContent = (
    <div className="grid gap-1 justify-content-center">
      <Button
        type="submit"
        label="Guardar"
        icon="pi pi-save"
        className="p-mt-2"
        onClick={onSubmit}
      />
      <Button
        label="Cancelar"
        icon="pi pi-times-circle"
        onClick={() => {
          handleHide();
        }}
        className="p-mt-2"
      />
    </div>
  );

  return (
    <Dialog
      header="Nuevo Historial de Precios"
      visible={modalVisible}
      style={{ width: "30vw" }}
      onHide={() => handleHide()}
      footer={footerContent}
    >
      <form>
        <div className="formgrid grid my-3">
          <div className="my-3 col-12">
            <FloatLabel>
              <Controller
                name="precioPaquete1"
                control={control}
                rules={{
                  required: "Valor Requerido",
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    autoFocus
                    showButtons
                    className={classNames("p-inputtext-sm w-full", {
                      "p-invalid": fieldState.invalid,
                    })}
                    mode="currency"
                    currency="MXN"
                    locale="es-MX"
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <label
                htmlFor="precioPaquete1"
                className={classNames({ "p-error": errors.precioPaquete1 })}
              >
                Paquete 1
              </label>
            </FloatLabel>
            {getFormErrorMessage("precioPaquete1")}
          </div>
          <div className="my-3 col-12">
            <FloatLabel>
              <Controller
                name="precioPaquete6"
                control={control}
                rules={{
                  required: "Valor Requerido",
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    className={classNames("p-inputtext-sm w-full", {
                      "p-invalid": fieldState.invalid,
                    })}
                    mode="currency"
                    currency="MXN"
                    locale="es-MX"
                    showButtons
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <label
                htmlFor="precioPaquete6"
                className={classNames({ "p-error": errors.precioPaquete6 })}
              >
                Paquete 6
              </label>
            </FloatLabel>
            {getFormErrorMessage("precioPaquete6")}
          </div>
          <div className="my-3 col-12">
            <FloatLabel>
              <Controller
                name="precioPaquete12"
                control={control}
                rules={{
                  required: "Valor Requerido",
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    className={classNames("p-inputtext-sm w-full", {
                      "p-invalid": fieldState.invalid,
                    })}
                    mode="currency"
                    currency="MXN"
                    locale="es-MX"
                    showButtons
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <label
                htmlFor="precioPaquete12"
                className={classNames({ "p-error": errors.precioPaquete12 })}
              >
                Paquete 12
              </label>
            </FloatLabel>
            {getFormErrorMessage("precioPaquete12")}
          </div>
          <div className="my-3 col-12">
            <FloatLabel>
              <Controller
                name="precioPaquete24"
                control={control}
                rules={{
                  required: "Valor Requerido",
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    className={classNames("p-inputtext-sm w-full", {
                      "p-invalid": fieldState.invalid,
                    })}
                    mode="currency"
                    currency="MXN"
                    locale="es-MX"
                    showButtons
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <label
                htmlFor="precioPaquete24"
                className={classNames({ "p-error": errors.precioPaquete24 })}
              >
                Paquete 24
              </label>
            </FloatLabel>
            {getFormErrorMessage("precioPaquete24")}
          </div>
          <div className="my-3 col-12">
            <FloatLabel>
              <Controller
                name="precioBaseMayoreo"
                control={control}
                rules={{
                  required: "Valor Requerido",
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    showButtons
                    min={0}
                    className={classNames("p-inputtext-sm w-full", {
                      "p-invalid": fieldState.invalid,
                    })}
                    mode="currency"
                    currency="MXN"
                    locale="es-MX"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <label
                htmlFor="precioBaseMayoreo"
                className={classNames({ "p-error": errors.precioBaseMayoreo })}
              >
                Paquete Base Mayoreo
              </label>
            </FloatLabel>
            {getFormErrorMessage("precioBaseMayoreo")}
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default NuevoHistorialModal;
