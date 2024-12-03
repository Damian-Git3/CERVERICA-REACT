import axios from "axios";

// Timeout para axios
axios.defaults.timeout = 5000;

// REACT_APP_BASE_URL se define en .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Interceptor para token expirado
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // TODO: Enviar a Cerverica Login, y borrar cache
    } else if (
      error.code === "ECONNABORTED" &&
      error.message.includes("timeout")
    ) {
      // TODO: Mostrar tiempo de espera agotado
    }

    return Promise.reject(error);
  }
);
