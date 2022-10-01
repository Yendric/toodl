import axios from "axios";
import { useSnackbar } from "notistack";

function useAxios() {
  const { enqueueSnackbar } = useSnackbar();

  const apiUrl = import.meta.env.VITE_API_URL + "/v1" ?? "http://localhost/api/v1";

  const api = axios.create({ baseURL: apiUrl });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response.data.message ?? "Er is iets fout gegaan";
      enqueueSnackbar(message, {
        variant: "warning",
      });
      throw new Error(message);
    }
  );
  return api;
}

export default useAxios;
