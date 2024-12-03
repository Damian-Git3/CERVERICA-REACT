import { useReducer, useState } from "react";
import axios from "axios";
import { SessionDTO } from "../dtos/SessionDTO";
import useSessionStore from "../stores/useSessionStore"; // Importa el store

const END_POINT = "/Account";

const initialState = {
  session: null as SessionDTO | null,
};

const AccountReducer = (state: any, action: any) => {
  const { payload, type } = action;

  switch (type) {
    case "UPDATE_SESSION":
      return {
        ...state,
        session: payload,
      };
    default:
      return state;
  }
};

export default function useAccount() {
  const [state, dispatch] = useReducer(AccountReducer, initialState);
  const [cargando, setCargando] = useState(false);

  const validateToken = async (token: string) => {
    try {
      setCargando(true);

      const response = await axios.get<SessionDTO>(
        `${END_POINT}/validate-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error al validar el token: ", error);
      return null;
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      setCargando(true);

      const response = await axios.post(`${END_POINT}/logout`);

      return response;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return {
    cargando,
    session: state.session,
    validateToken,
    cerrarSesion,
  };
}
