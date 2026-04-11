import type { AxiosRequestConfig } from "axios";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/v1" : "http://localhost:3001/api/v1";

const axiosInstance = axios.create({ baseURL: apiUrl, withCredentials: true });

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export const api = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};

export default axiosInstance;
