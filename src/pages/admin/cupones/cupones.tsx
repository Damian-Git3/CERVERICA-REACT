import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCupones from "../../../hooks/useCupones";
import { images } from "../../../constants";
import "./Cupones.css";

const Cupones = () => {
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

    const handleCardPress = () => {
      navigate("/(admin)/cupones/formularioCupones", {
        state: { cupon: item },
      });
    };

    const opcionesPaquete = [
      { label: "Total de la compra", value: 0 },
      { label: "1 cerveza", value: 1 },
      { label: "6 cervezas", value: 6 },
      { label: "12 cervezas", value: 12 },
      { label: "24 cervezas", value: 24 },
    ];

    const paqueteSeleccionado = opcionesPaquete.find(
      (opcion) => opcion.value === item.paquete
    );

    return (
      <div className="card-cupon" onClick={handleCardPress}>
        <div className="yellowSection">
          <span className="discountText">{discountText}</span>
        </div>
        <div className="whiteSection">
          <h3 className="couponTitle">Código: {item.codigo}</h3>
          <p className="couponText">
            {`Monto mínimo: ${item.montoMinimo} MXN`}
          </p>
          <p className="couponText">
            Paquete:{" "}
            {paqueteSeleccionado
              ? paqueteSeleccionado.label
              : "Paquete no encontrado"}
          </p>
          <p className="couponText">Cantidad de cupones: {item.cantidad}</p>
          <p className="couponText">Cupones usados: {item.usos}</p>
          <p className="couponText">
            Expira el:{" "}
            {isNaN(new Date(item.fechaExpiracion).getTime())
              ? "Fecha inválida"
              : new Date(item.fechaExpiracion).toLocaleDateString()}
          </p>

          <div className="statusIndicator">
            {item.activo ? "Activo" : "Inactivo"}
            <span
              className={`statusDot ${item.activo ? "active" : "inactive"}`}
            ></span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <button className="addButton" onClick={handleAddCoupon}>
        Agregar Cupon
      </button>
      <h1 className="title">Cupones Disponibles</h1>

      {cargando ? (
        <div className="loading">Cargando...</div>
      ) : cupones && cupones.length > 0 ? (
        <div className="couponList">
          {cupones.map((item) => renderCouponCard(item))}
        </div>
      ) : (
        <div className="noCouponsContainer">
          <img
            src={images.noResult}
            alt="No se encontraron cupones"
            className="noResultImage"
          />
          <p>No hay cupones disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default Cupones;
