import { useEffect, useState } from "react";
import useSolicitudesMayoristas from "../hooks/useSolicitudesMayoristas";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { SolicitudMayorista } from "../models/SolicitudesMayoristas";

interface EstadoConfig {
  severity: string;
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

  const [filtroEstatus, setFiltroEstatus] = useState<number | null>(null);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState<
    SolicitudMayorista[]
  >([]);

  const estadoConfig: EstadosMapping = {
    2: {
      severity: "success",
      label: "Confirmando",
      icon: "pi pi-check-circle",
      className: "p-button-success",
    },
    3: {
      severity: "info",
      label: "Concretada",
      icon: "pi pi-check-square",
      className: "p-button-info",
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
      <Tag
        /* severity={config.severity}  */
        severity="success"
        value={config.label}
        icon={config.icon}
      />
    );
  };

  const cardFooter = (solicitud: SolicitudMayorista) => (
    <div className="flex flex-wrap justify-content-between gap-2">
      <Button
        label="Ver Detalles"
        icon="pi pi-eye"
        className="p-button-outlined"
      />
    </div>
  );

  return (
    <div className="p-4">
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          label="Todas"
          icon="pi pi-list"
          className={`p-button-primary ${
            filtroEstatus == null ? "" : "p-button-outlined"
          }`}
          onClick={() => setFiltroEstatus(null)}
        />
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
          <div key={solicitud.id} className="col-12 md:col-6 lg:col-4">
            <Card
              className="h-full shadow-3 border-round-xl hover:shadow-5 transition-all transition-duration-300"
              title={
                <div className="flex align-items-center justify-content-between">
                  <span className="font-semibold text-xl">
                    {solicitud.mayorista?.nombreContacto || "Cliente"}
                  </span>
                  {getEstatusTag(solicitud.estatus)}
                </div>
              }
              subTitle={
                <div className="text-500">Solicitud #{solicitud.id}</div>
              }
              footer={cardFooter(solicitud)}
            >
              <div className="flex flex-column gap-3">
                <div className="flex justify-content-between align-items-center p-2 surface-100 border-round">
                  <span className="font-semibold">Fecha:</span>
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
              </div>
            </Card>
          </div>
        ))}
      </div>

      {!cargandoSolicitudesMayoristas && solicitudesFiltradas.length === 0 && (
        <div className="flex flex-column align-items-center gap-3 mt-6 surface-ground p-6 border-round">
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
    </div>
  );
}
