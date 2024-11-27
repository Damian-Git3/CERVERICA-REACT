import { Dialog } from "primereact/dialog";
import { SolicitudMayorista } from "../../models/SolicitudesMayoristas";
import useSolicitudesMayoristas from "../../hooks/useSolicitudesMayoristas";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProgressBar } from "primereact/progressbar";
import { ProductoCarrito } from "../../models/ProductoCarrito";
import { classNames } from "primereact/utils";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import usePedidosMayoristas from "../../hooks/usePedidosMayoristas";
import { PedidoMayoristaInsertDTO } from "../../DTOs/PedidosMayoristas/PedidoMayoristaInsertDTO";
import { ToastContext } from "../../App";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm, Controller } from "react-hook-form";

interface ModalConfirmarSolicitudProps {
  visible: boolean;
  onHide: () => void;
  solicitud: SolicitudMayorista | null;
  actualizarSolicitudesMayoristas: () => void;
  configuracionVentasMayoreo: any;
}

interface FormData {
  plazosSeleccionados: number;
  observaciones?: string;
}

export const ModalConfirmarSolicitud = ({
  visible,
  onHide,
  solicitud,
  actualizarSolicitudesMayoristas,
  configuracionVentasMayoreo,
}: ModalConfirmarSolicitudProps) => {
  const {
    obtenerCarritoSolicitud,
    carritoSolicitud,
    cargando: cargandoSolicitudesMayoristas,
  } = useSolicitudesMayoristas();

  const { crearPedidoMayorista, cargando: cargandoPedidosMayoristas } =
    usePedidosMayoristas();

  const [numeroPlazos, setNumeroPlazos] = useState<{ name: string; value: number }[]>([]);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const toast = useContext(ToastContext);

  useEffect(() => {
    if (visible && solicitud) {
      obtenerCarritoSolicitud(solicitud.id);
    }
  }, [visible, solicitud]);

  useEffect(() => {
    if (!configuracionVentasMayoreo) return;

    const plazos = [];
    for (let i = 1; i <= configuracionVentasMayoreo.plazoMaximoPago; i++) {
      plazos.push({ name: `${i} Meses`, value: i });
    }
    setNumeroPlazos(plazos);
  }, [configuracionVentasMayoreo]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const itemTemplate = (productoCarrito: ProductoCarrito, index: number) => {
    return (
      <div className="col-12 flex-column" key={productoCarrito.id}>
        <div
          className={classNames("flex align-items-center p-4 gap-4", {
            "border-top-1 surface-border": index !== 0,
          })}
        >
          <img
            className="h-10rem block mx-auto border-round"
            src={productoCarrito.receta.imagen}
            alt={productoCarrito.receta.nombre}
          />

          <div className="flex flex-column justify-content-between align-items-center flex-1 gap-4">
            <div className="flex flex-column align-items-center gap-3">
              <div className="text-xl font-bold text-900">
                {productoCarrito.receta.nombre}
              </div>

              <div className="text-base text-900">
                Cantidad: {productoCarrito.cantidad}
              </div>
            </div>
          </div>

          <div className="flex flex-column justify-content-between align-items-center flex-1 gap-4">
            <div className="text-xl font-bold text-900">
              {formatCurrency(productoCarrito.receta.precioUnitarioBaseMayoreo)}{" "}
              c/u
            </div>
          </div>

          <div className="flex flex-column justify-content-between align-items-center flex-1 gap-4">
            <div className="text-xl font-bold text-900 text-blue-500">
              Total:{" "}
              {formatCurrency(
                productoCarrito.receta.precioUnitarioBaseMayoreo *
                  productoCarrito.cantidad
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items: ProductoCarrito[]) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return itemTemplate(product, index);
    });

    return <div className="grid grid-nogutter">{list}</div>;
  };

  const obtenerTotalVenta = () => {
    if (!carritoSolicitud) return 0;

    return carritoSolicitud.reduce(
      (acc: number, productoCarrito: ProductoCarrito) => {
        return (
          acc +
          productoCarrito.receta.precioUnitarioBaseMayoreo *
            productoCarrito.cantidad
        );
      },
      0
    );
  };

  const confirmarSolicitud = async (data: FormData) => {
    const nuevoPedidoMayorista: PedidoMayoristaInsertDTO = {
      idMayorista: solicitud!.idMayorista,
      idSolicitudMayorista: solicitud!.id,
      plazoMeses: data.plazosSeleccionados,
      observaciones: data.observaciones || "",
      listaCervezas: carritoSolicitud.map(
        (productoCarrito: ProductoCarrito) => ({
          idReceta: productoCarrito.receta.id,
          cantidad: productoCarrito.cantidad,
        })
      ),
    };

    const result = await crearPedidoMayorista(nuevoPedidoMayorista);

    if (result?.status == 200) {
      toast?.current?.show({
        severity: "success",
        summary: "Solicitud confirmada",
        detail: "Manos a la obra!, producción en proceso",
      });

      actualizarSolicitudesMayoristas();
    }
  };

  const handleConfirmarSolicitud = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: "¿Estás seguro de confirmar la solicitud?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptLabel: "Sí",
      rejectLabel: "Cancelar",
      accept: handleSubmit(confirmarSolicitud),
    });
  };

  const handleHide = () => {
    onHide();
    // Limpia el estado del carrito aquí si es necesario
  };

  return (
    <Dialog
      header="Confirmar Solicitud"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={handleHide}
      draggable={false}
    >
      <ConfirmPopup />

      {(cargandoSolicitudesMayoristas || cargandoPedidosMayoristas) && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px" }}
          color="#ed9224"
          title="Cargando..."
        />
      )}

      <DataView value={carritoSolicitud} listTemplate={listTemplate} />

      <div className="flex justify-content-end text-2xl font-bold text-900">
        Total de la venta:
        <span className="text-blue-600">
          {formatCurrency(obtenerTotalVenta())}
        </span>
      </div>

      <div className="mb-5">
        <Controller
          name="plazosSeleccionados"
          control={control}
          rules={{ required: "El plazo de pago es obligatorio" }}
          render={({ field }) => (
            <Dropdown
              {...field}
              options={numeroPlazos}
              optionLabel="name"
              placeholder="Selecciona el plazo de pago"
              className={classNames("w-full", {
                "p-invalid": errors.plazosSeleccionados,
              })}
            />
          )}
        />
        {errors.plazosSeleccionados && (
          <small className="p-error">
            {errors.plazosSeleccionados.message}
          </small>
        )}

        <Controller
          name="observaciones"
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={5}
              cols={30}
              placeholder="Observaciones (opcional)"
            />
          )}
        />
      </div>

      <div className="flex justify-content-end mt-3">
        <Button label="Confirmar" onClick={handleConfirmarSolicitud} />
      </div>
    </Dialog>
  );
};