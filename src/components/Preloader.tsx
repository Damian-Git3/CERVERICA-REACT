import "../css/Preloader.css";
import logo from "../assets/img/logo-completo.png";
import { useEffect, useState, useRef } from "react";
import useAccount from "../hooks/useAccount";
import useSessionStore from "../stores/useSessionStore";
import { Navigate } from "react-router";
import axios from "axios";

export default function Preloader() {
  const [redirigirAInicio, setRedirigirAInicio] = useState(false);
  const { validateToken } = useAccount();
  const { session, setSession } = useSessionStore();
  const windowOpenedRef = useRef(false);

  const validarToken = async () => {
    if (session) {
      setRedirigirAInicio(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      const response = await validateToken(token);

      if (response?.status === 200) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        setSession(response.data);
      }

      setRedirigirAInicio(true);
    } else if (!windowOpenedRef.current) {
      windowOpenedRef.current = true;
      window.location.href = `http://localhost:4200/cerverica/inicio?cerrarsesion=1`;
    }
  };

  useEffect(() => {
    validarToken();
  }, []);

  if (redirigirAInicio) {
    return <Navigate to="/inicio" />;
  }

  return (
    <div className="preloader-wrapper">
      <div className="loader-container">
        <img src={logo} alt="Logo" className="loader-image" />
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>

      <div className="texto-loader">
        Obteniendo sesión
        <span className="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}
