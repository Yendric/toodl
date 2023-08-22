import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL + "/v1" ?? "http://localhost:3001/api/v1";

const api = axios.create({ baseURL: apiUrl, withCredentials: true });

api.defaults.headers.common["Content-Type"] = "application/json";
api.defaults.withCredentials = true;

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Geen error in console maar error handling wel nog mogelijk
    return Promise.reject(error);
  },
);

export default api;
