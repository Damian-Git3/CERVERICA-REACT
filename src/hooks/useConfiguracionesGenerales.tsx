import { useReducer, useState } from "react";
import axios from "axios";
import { IConfiguracionesGenerales } from "./../dtos/configuracionesGenerales";

// Estado inicial para el reducer
const initialState = {
  configuracionesGenerales: null as IConfiguracionesGenerales | null,
};

// Reducer para manejar las acciones
const configuracionesGeneralesReducer = (state: typeof initialState, action: any) => {
  const { payload, type } = action;

  switch (type) {
    case "REGISTRAR_CONFIGURACION":
      return {
        ...state,
        configuracionesGenerales: payload,
      };
    case "ACTUALIZAR_CONFIGURACION":
      return {
        ...state,
        configuracionesGenerales: payload, 
      };
    case "FETCH_CONFIGURACION_GENERAL":
      return { ...state, configuracionesGenerales: payload };

    default:
      return state;
  }
};

// Hook personalizado para manejar configuraciones generales
export default function useConfiguracionesGenerales() {
  const [state, dispatch] = useReducer(configuracionesGeneralesReducer, initialState);
  const [cargando, setCargando] = useState(false);

  // Registrar nuevas configuraciones generales
  const registrarConfiguracionesGenerales = async (configuracionesGenerales: IConfiguracionesGenerales) => {
    setCargando(true);
    try {
      const response = await axios.post(
        `/ConfiguracionesGenerales/registrar-configuracion-general`,
        configuracionesGenerales
      );
      dispatch({
        type: "REGISTRAR_CONFIGURACION",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error("Error al registrar la configuración:", error);
      return null;
    } finally {
      setCargando(false);
    }
  };

  // Actualizar configuraciones generales existentes
  const actualizarConfiguracionesGenerales = async (configuracionesGenerales: IConfiguracionesGenerales) => {
    setCargando(true);
    try {
      const response = await axios.put(
        `/ConfiguracionesGenerales/actualizar-configuracion-general`,
        configuracionesGenerales
      );
      dispatch({
        type: "ACTUALIZAR_CONFIGURACION",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
      return null;
    } finally {
      setCargando(false);
    }
  };

  // Obtener configuraciones generales desde la API
  const getConfiguracionesGenerales = async () => {
    setCargando(true);
    try {
      const response = await axios.get(`/ConfiguracionesGenerales/obtener-configuracion-general`);
      dispatch({
        type: "FETCH_CONFIGURACION_GENERAL",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener las configuraciones:", error);
      return null;
    } finally {
      setCargando(false);
    }
  };

  // Retorno del hook con las funciones y datos necesarios
  return {
    cargando,
    configuracionesGenerales: state.configuracionesGenerales,
    registrarConfiguracionesGenerales,
    actualizarConfiguracionesGenerales,
    getConfiguracionesGenerales,
  };
}
