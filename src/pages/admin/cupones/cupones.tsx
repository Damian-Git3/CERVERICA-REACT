import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCupones from "../../../hooks/useCupones";
import { images } from "../../../constants";
import "./Cupones.css";

const Cupones: React.FC = () => {
  const { cargando, cupones, getCupones } = useCupones();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCupones = async () => {
      await getCupones();
    };
    
    fetchCupones();
  }, []);

  const handleAddCoupon = () => {
    navigate("/(admin)/cupones/formularioCupones");
  };

  const renderCouponCard = (item: any) => {
    const discountText =
      item.tipo === 1 ? `${item.valor}%` : `$${item.valor.toFixed(2)}`;

    const categoriaComprador = {
      1: "Todos",
      2: "Frecuente",
      3: "Minorista",
      4: "Mayorista",
      5: "Inactivo",
    };

    const handleCardPress = () => {
      navigate("/(admin)/cupones/formularioCupones", { state: { cupon: item } });
    };

    return (
      <div className="card-cupon" onClick={handleCardPress}>
        <div className="yellowSection">
          <span className="discountText">{discountText}</span>
        </div>
        <div className="whiteSection">
          <h3 className="couponTitle">Código: {item.codigo}</h3>
          <p className="couponText">Monto maximo: {item.montoMaximo} MXN</p>
          <p className="couponText">Paquete: {item.paquete}</p>
          <p className="couponText">Usos: {item.usos}</p>
          <p className="couponText">
            Categoría comprador: {categoriaComprador[item.categoriaComprador] || "Desconocido"}
          </p>
          <p className="couponText">
            Expira el: {isNaN(new Date(item.fechaExpiracion)) ? "Fecha inválida" : new Date(item.fechaExpiracion).toLocaleDateString()}
          </p>
          <p className="couponText">
            Estatus: {item.activo ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <button className="addButton" onClick={handleAddCoupon}>Agregar Cupon</button>
      <h1 className="title">Cupones Disponibles</h1>

      {cargando ? (
        <div className="loading">Cargando...</div>
      ) : cupones && cupones.length > 0 ? (
        <div className="couponList">
          {cupones.map((item) => renderCouponCard(item))}
        </div>
      ) : (
        <div className="noCouponsContainer">
          <img src={images.noResult} alt="No se encontraron cupones" className="noResultImage" />
          <p>No hay cupones disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default Cupones;
