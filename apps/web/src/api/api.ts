import type { AxiosRequestConfig } from "axios";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/v1" : "http://localhost:3001/api/v1";

export const axiosInstance = axios.create({ baseURL: apiUrl, withCredentials: true });

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);

// Orval with httpClient: 'axios' and a custom mutator passes the config as the first argument.
export const api = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data as T);
};

export default axiosInstance;
