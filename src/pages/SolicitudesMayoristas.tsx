import { useEffect, useState } from "react";
import useSolicitudesMayoristas from "../hooks/useSolicitudesMayoristas";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import {
  EstatusSolicitudMayorista,
  SolicitudMayorista,
} from "../models/SolicitudesMayoristas";
import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";
import { ModalConfirmarSolicitud } from "../components/SolicitudesMayoristas/ModalConfirmarSolicitud";
import useConfiguracionVentasMayoreo from "../hooks/useConfiguracionVentasMayoreo";

interface EstadoConfig {
  severity:
    | "info"
    | "success"
    | "danger"
    | "warning"
    | "secondary"
    | "contrast";
  label: string;
  icon: string;
  className: string;
}

interface EstadosMapping {
  [key: number]: EstadoConfig;
}

export default function SolicitudesMayoristas() {
  const {
    cargando: cargandoSolicitudesMayoristas,
    getSolicitudesAgente,
    solicitudesMayoristas,
  } = useSolicitudesMayoristas();

  const [filtroEstatus, setFiltroEstatus] = useState<number | null>(2);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState<
    SolicitudMayorista[]
  >([]);
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudMayorista | null>(null);
  const { getConfiguracionVentasMayoreo, configuracionVentasMayoreo } =
    useConfiguracionVentasMayoreo();

  const estadoConfig: EstadosMapping = {
    2: {
      severity: "info",
      label: "Confirmando",
      icon: "pi pi-check-circle",
      className: "p-button-info",
    },
    3: {
      severity: "success",
      label: "Concretada",
      icon: "pi pi-check-square",
      className: "p-button-success",
    },
    4: {
      severity: "danger",
      label: "Cancelada",
      icon: "pi pi-times-circle",
      className: "p-button-danger",
    },
    5: {
      severity: "danger",
      label: "Rechazada",
      icon: "pi pi-ban",
      className: "p-button-danger",
    },
  };

  useEffect(() => {
    getConfiguracionVentasMayoreo();
    getSolicitudesAgente();
  }, []);

  useEffect(() => {
    if (solicitudesMayoristas) {
      const solicitudes =
        filtroEstatus !== null
          ? solicitudesMayoristas.filter(
              (s: SolicitudMayorista) => s.estatus === filtroEstatus
            )
          : solicitudesMayoristas;
      setSolicitudesFiltradas(solicitudes);
    }
  }, [solicitudesMayoristas, filtroEstatus]);

  const getEstatusTag = (estatus: number) => {
    const config = estadoConfig[estatus];
    return (
      <Tag severity={config.severity} value={config.label} icon={config.icon} />
    );
  };

  const PasosRechazado: MenuItem[] = [
    {
      label: "Rechazado",
    },
  ];

  const PasosCancelado: MenuItem[] = [
    {
      label: "Cancelado",
    },
  ];

  const PasosNormal: MenuItem[] = [
    {
      label: "Nuevo pedido",
    },
    {
      label: "Confirmando",
      style: { color: "#ed9224" },
    },
    {
      label: "Concretada",
    },
  ];

  const getActiveStep = (estatus: number) => {
    switch (estatus) {
      case 1: // Nuevo Pedido
        return 0;
      case 2: // Confirmando
        return 1;
      case 3: // Concretado
        return 2;
      case 4: // Cancelado
      case 5: // Rechazado
        return 0;
      default:
        return 0; // Valor por defecto
    }
  };

  const handleSolicitudClick = (idSolicitud: number) => {
    const solicitud = solicitudesFiltradas.find((s) => s.id === idSolicitud);

    switch (solicitud?.estatus) {
      case EstatusSolicitudMayorista.NuevoPedido:
        break;

      case EstatusSolicitudMayorista.Confirmando:
        setSolicitudSeleccionada(solicitud);
        setMostrarModalConfirmar(true);
        break;

      case EstatusSolicitudMayorista.Concretado:
        break;

      case EstatusSolicitudMayorista.Cancelado:
        break;

      case EstatusSolicitudMayorista.Rechazado:
        break;
    }
  };

  const actualizarSolicitudesMayoristas = () => {
    setMostrarModalConfirmar(false);
    getSolicitudesAgente();
  };

  return (
    <div>
      <h1 className="text-center">Solicitudes mayoristas</h1>
      <div className="mb-4 flex flex-wrap gap-2 align-items-center justify-content-center">
        {Object.entries(estadoConfig).map(([estatus, config]) => (
          <Button
            key={estatus}
            label={config.label}
            icon={config.icon}
            className={`${config.className} ${
              filtroEstatus === Number(estatus) ? "" : "p-button-outlined"
            }`}
            onClick={() => setFiltroEstatus(Number(estatus))}
          />
        ))}
        <Button
          label="Todas"
          icon="pi pi-list"
          className={`p-button-primary ${
            filtroEstatus == null ? "" : "p-button-outlined"
          }`}
          onClick={() => setFiltroEstatus(null)}
        />
      </div>

      {cargandoSolicitudesMayoristas && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px" }}
          color="#ed9224"
        />
      )}

      <div className="grid">
        {solicitudesFiltradas.map((solicitud: SolicitudMayorista) => (
          <div key={solicitud.id} className="col-12 md:col-6 lg:col-3">
            <Card
              className="h-full shadow-3 border-round-xl hover:shadow-5 transition-all transition-duration-300 cursor-pointer"
              title={
                <div className="flex align-items-center justify-content-between">
                  <span className="font-semibold text-xl">
                    Nombre contacto:{" "}
                    {solicitud.mayorista?.nombreContacto || "Cliente"}
                  </span>
                  {getEstatusTag(solicitud.estatus)}
                </div>
              }
              subTitle={
                <div className="text-500">Solicitud #{solicitud.id}</div>
              }
              onClick={() => handleSolicitudClick(solicitud.id)}
            >
              <div className="flex flex-column gap-3">
                <div className="flex justify-content-between align-items-center p-2 surface-100 border-round">
                  <span className="font-semibold">Fecha inicio:</span>
                  <span className="text-500">
                    {new Date(solicitud.fechaInicio).toLocaleDateString(
                      "es-MX",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="p-2 surface-100 border-round">
                  <span className="font-semibold">Dirección:</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      solicitud.mayorista?.direccionEmpresa ||
                        "Dirección no disponible"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline ml-2"
                  >
                    {solicitud.mayorista?.direccionEmpresa ||
                      "Dirección no disponible"}
                  </a>
                </div>

                <div className="p-2 surface-100 border-round">
                  <span className="font-semibold">Teléfono contacto:</span>
                  <a
                    href={`tel:${solicitud.mayorista?.telefonoContacto}`}
                    className="text-primary-500 hover:underline ml-2"
                  >
                    {solicitud.mayorista?.telefonoContacto || "No disponible"}
                  </a>
                </div>

                <div className="p-2 surface-100 border-round">
                  <span className="font-semibold">Email contacto:</span>
                  <a
                    href={`mailto:${solicitud.mayorista?.emailContacto}`}
                    className="text-primary-500 hover:underline ml-2"
                  >
                    {solicitud.mayorista?.emailContacto || "No disponible"}
                  </a>
                </div>

                {solicitud.estatus === 5 && solicitud.mensajeRechazo && (
                  <div className="mt-2 p-3 surface-danger-50 border-round">
                    <p className="font-semibold mb-2 text-900">
                      <i className="pi pi-info-circle mr-2" />
                      Motivo de rechazo:
                    </p>
                    <p className="line-clamp-2 text-sm text-700">
                      {solicitud.mensajeRechazo}
                    </p>
                  </div>
                )}

                <div>
                  <Steps
                    model={
                      solicitud.estatus === 5
                        ? PasosRechazado
                        : solicitud.estatus === 4
                        ? PasosCancelado
                        : PasosNormal
                    }
                    activeIndex={getActiveStep(solicitud.estatus)}
                  />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {!cargandoSolicitudesMayoristas && solicitudesFiltradas.length === 0 && (
        <div className="flex flex-column align-items-center gap-3 mt-6 justify-content-center h-20rem">
          <i className="pi pi-inbox text-5xl text-500" />
          <h3 className="text-500 m-0">No hay solicitudes mayoristas</h3>
          {filtroEstatus && (
            <Button
              label="Ver todas las solicitudes"
              className="p-button-text"
              onClick={() => setFiltroEstatus(null)}
            />
          )}
        </div>
      )}

      <ModalConfirmarSolicitud
        visible={mostrarModalConfirmar}
        onHide={() => setMostrarModalConfirmar(false)}
        solicitud={solicitudSeleccionada}
        actualizarSolicitudesMayoristas={actualizarSolicitudesMayoristas}
        configuracionVentasMayoreo={configuracionVentasMayoreo}
      />
    </div>
  );
}
