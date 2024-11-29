import React, { useEffect } from 'react';
import usePuntosFidelidad from './../../hooks/usePuntosFidelidad';

const PuntosFidelidad = () => {
  const {
    getPuntosFidelidad,
    getTransacciones,
    puntosFidelidad,
    transacciones,
    cargando,
  } = usePuntosFidelidad();

  useEffect(() => {
    getPuntosFidelidad();
    getTransacciones();
  }, []);

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 className='tile'>Puntos de Fidelidad</h1>
        {puntosFidelidad ? (
          <div style={{ marginTop: '20px' }}>
            <p>Puntos Acumulados: {puntosFidelidad.puntosAcumulados ?? 0}</p>
            <p>Puntos Redimidos: {puntosFidelidad.puntosRedimidos ?? 0}</p>
            <p>Puntos Disponibles: {puntosFidelidad.puntosDisponibles ?? 0}</p>
            <p>
              Fecha Última Actualización: {puntosFidelidad.fechaUltimaActualizacion 
                ? new Date(puntosFidelidad.fechaUltimaActualizacion).toLocaleDateString()
                : 'No disponible'}
            </p>
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <p>Puntos Acumulados: 0</p>
            <p>Puntos Redimidos: 0</p>
            <p>Puntos Disponibles: 0</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Transacciones</h2>
        {transacciones && transacciones.length > 0 ? (
          transacciones.map((transaccion) => (
            <div key={transaccion.id} style={{ marginBottom: '10px' }}>
              <p>ID Transacción: {transaccion.id}</p>
              <p>Puntos: {transaccion.puntos}</p>
              <p>Tipo de Transacción: {transaccion.tipoTransaccion}</p>
              <p>
                Fecha: {new Date(transaccion.fechaTransaccion).toLocaleDateString()}
              </p>
              <p>Descripción: {transaccion.descripcion}</p>
            </div>
          ))
        ) : (
          <p>No hay transacciones disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default PuntosFidelidad;
