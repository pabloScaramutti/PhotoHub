import Axios from "axios";
import configServidor from "@/config/servidor.json";

const InstanciaAxios = Axios.create({
  baseURL: `${configServidor.host}:${configServidor.puerto}`
});

InstanciaAxios.interceptors.request.use(
  config => {
    let token = localStorage.getItem("authtoken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default InstanciaAxios;
