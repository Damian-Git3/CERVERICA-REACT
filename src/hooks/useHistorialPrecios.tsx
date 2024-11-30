import axios from "axios";
import { useContext, useReducer, useState } from "react";
import { ToastContext } from "../App";
import { HistorialPrecioInsert } from "../DTOs/HistorialPrecios";

const initialState = {
  listaRecetas: [],
  historial: [],
};

const HistorialPreciosReducer = (state: any, action: any) => {
  const { payload, type } = action;

  switch (type) {
    case "UPDATE_LISTA_RECETAS":
      return {
        ...state,
        listaRecetas: payload,
      };
    case "GET_PRECIOS_RECETA":
      return {
        ...state,
        recetaPrecios: payload,
      };
    case "GET_HISTORIAL_PRECIOS":
      return {
        ...state,
        historialPrecios: payload,
      };
    case "GET_RECETA":
      return {
        ...state,
        receta: payload,
      };
    default:
      return state;
  }
};

const useHistorialPrecios = () => {
  const toast = useContext(ToastContext);
  const [state, dispatch] = useReducer(HistorialPreciosReducer, initialState);

  const [cargando, setCargando] = useState(false);

  const getListaRecetas = async () => {
    try {
      const response = await axios.get("/HistorialPrecios/ListarRecetas");

      dispatch({
        type: "UPDATE_LISTA_RECETAS",
        payload: response.data,
      });

      toast?.current?.show({
        severity: "success",
        summary: "Recetas obtenidas! 🎉",
        detail: "Se han obtenido las recetas correctamente",
      });

      return response.data;
    } catch (error) {
      toast?.current?.show({
        severity: "error",
        summary: "Error! 🎉",
        detail: error as string,
      });
    } finally {
      setCargando(false);
    }
  };

  const getPrecioReceta = async (id: number) => {
    try {
      const response = await axios.get(`/HistorialPrecios/PreciosReceta`, {
        params: {
          Id: id,
        },
      });

      dispatch({
        type: "GET_PRECIOS_RECETA",
        payload: response.data,
      });

      toast?.current?.show({
        severity: "success",
        summary: "Precios de receta obtenidos! 🎉",
        detail: "Se han obtenido los precios de la receta correctamente",
      });

      return response.data;
    } catch (error) {
      console.error("Error los precios de receta", error);
      toast?.current?.show({
        severity: "error",
        summary: "Error! 🎉",
        detail: error as string,
      });
    } finally {
      setCargando(false);
    }
  };

  const getHistorialPrecios = async (id: number) => {
    try {
      const response = await axios.get(
        `/HistorialPrecios/ListaHistorialPrecios`,
        {
          params: {
            IdReceta: id,
          },
        }
      );

      dispatch({
        type: "GET_HISTORIAL_PRECIOS",
        payload: response.data,
      });

      toast?.current?.show({
        severity: "success",
        summary: "Historial de precios obtenido! 🎉",
        detail: "Se ha obtenido el historial de precios correctamente",
      });
      return response.data;
    } catch (error) {
      console.error("Error los precios de receta", error);
      toast?.current?.show({
        severity: "error",
        summary: "Error! 🎉",
        detail: error as string,
      });
    } finally {
      setCargando(false);
    }
  };

  const setNuevoPrecio = async (data: HistorialPrecioInsert): Promise<any> => {
    try {
      setCargando(true);
      const response = await axios.post(`/HistorialPrecios`, data);

      toast?.current?.show({
        severity: "success",
        summary: "Precio insertado! 🎉",
        detail: "Se ha insertado el precio correctamente",
      });
      return response;
    } catch (error) {
      console.error("Error al insertar nuevo precio", error);
      toast?.current?.show({
        severity: "error",
        summary: "Error! 🎉",
        detail: error as string,
      });
    } finally {
      setCargando(false);
    }
  };

  const getReceta = async (id: number): Promise<any> => {
    try {
      setCargando(true);
      const response = await axios.get(`/Receta/${id}`);

      dispatch({
        type: "GET_RECETA",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener receta", error);
      toast?.current?.show({
        severity: "error",
        summary: "Error! 🎉",
        detail: error as string,
      });
    } finally {
      setCargando(false);
    }
  };

  return {
    cargando,
    listaRecetas: state.listaRecetas,
    recetaPrecios: state.recetaPrecios,
    receta: state.receta,
    historialPrecios: state.historialPrecios,
    getListaRecetas,
    getPrecioReceta,
    getReceta,
    getHistorialPrecios,
    setNuevoPrecio,
  };
};

export default useHistorialPrecios;
