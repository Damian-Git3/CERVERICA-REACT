import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { images } from "../../../constants";
import './reglasPuntos.css';
import usePuntosFidelidad from "../../../hooks/usePuntosFidelidad";

const ReglaPuntos = () => {
  const {
    cargando,
    reglasPuntos,
    getReglasPuntos,
  } = usePuntosFidelidad();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getReglasPuntos();
    };

    fetchData();
  }, []);


  const handleButtonClick = () => {
    if (reglasPuntos) {
      navigate("/(admin)/puntos/formularioReglasPuntos", { state: { reglasPuntos } });
    } else {
      navigate("/(admin)/puntos/formularioReglasPuntos");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Reglas de Puntos de Fidelidad</h1>
      {cargando ? (
        <Spinner animation="border" variant="primary" />
      ) : reglasPuntos ? (
        <div className="details">
          <p className="text">
            <strong>Valor MXN por Punto:</strong> {reglasPuntos.valorMXNPunto}
          </p>
          <p className="text">
            <strong>Monto Mínimo:</strong> {reglasPuntos.montoMinimo}
          </p>
          <p className="text">
            <strong>Porcentaje de Conversión:</strong> {reglasPuntos.porcentajeConversion}
          </p>
          <p className="text">
            <strong>Fecha de Modificación:</strong>{" "}
            {new Date(reglasPuntos.fechaModificacion).toLocaleDateString()}
          </p>
          <button className="button" onClick={handleButtonClick}>
            Actualizar Reglas de Puntos
          </button>
        </div>
      ) : (
        <>
          <div className="container-datos">
            <img
              src={images.noResult}
              alt="No se encontraron datos"
              className="image"
            />
            <p>No existen reglas de puntos</p>


            <button className="button" onClick={handleButtonClick}>
              Registrar Reglas de Puntos
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReglaPuntos;
