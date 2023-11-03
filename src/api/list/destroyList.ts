import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { LocalList } from "../../types/List";
import { destroyLocal } from "../offlineHelpers";
import { destroy } from "./api";

export const useDestroyList = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ["destroyList"],
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["lists"]);
      destroyLocal<LocalList>(payload, queryClient, ["lists"]);
      enqueueSnackbar("Lijst verwijderd");
    },
    onSuccess: () => {
      console.log("[SYNC] Lijst gesynchroniseerd met server (DESTROY)");
    },
    mutationFn: destroy,
  });
};
