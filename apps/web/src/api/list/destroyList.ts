import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import IList from "../../types/IList";
import { destroyLocal } from "../offlineHelpers";
import { destroy } from "./api";

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["lists"]);
      destroyLocal<IList>(payload, queryClient, ["lists"]);
      enqueueSnackbar("Lijst verwijderd");
    },
    onSuccess: () => {
      console.log("[SYNC] Lijst gesynchroniseerd met server (DESTROY)");
    },
    mutationFn: destroy,
  });
};
