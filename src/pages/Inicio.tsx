import { useEffect, useState } from "react";
import "../css/Inicio.css";
import logoCompleto from "../assets/img/logo-completo.png";

const Inicio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");

  const welcomeTexts = [
    "Bienvenido a Cerverica CRM",
    "Controla tus clientes",
    "Administra tus ventas",
  ];

  useEffect(() => {
    setIsVisible(true);

    const textInterval = setInterval(() => {
      setFadeState("fade-out");

      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % welcomeTexts.length);
        setFadeState("fade-in");
      }, 500);
    }, 4000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className={`inicio ${isVisible ? "visible" : ""}`}>
      <div className="content">
        <div>
          <img src={logoCompleto} alt="Logo cerverica" className="logo-img" />
        </div>

        <h1 className={`title ${fadeState}`}>{welcomeTexts[textIndex]}</h1>

        <p className="subtitle">
          Descubre todas las funcionalidades que te ofrece el sistema
        </p>
      </div>
    </div>
  );
};

export default Inicio;
