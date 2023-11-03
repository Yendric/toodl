import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { LocalList } from "../../types/List";
import { updateLocal } from "../offlineHelpers";
import { sortFn, update } from "./api";

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ["updateList"],
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["lists"]);
      updateLocal<LocalList>(payload, queryClient, ["lists"], sortFn);
      enqueueSnackbar("Lijst gewijzigd");
    },
    onSuccess: () => {
      console.log("[SYNC] Lijst gesynchroniseerd met server (UPDATE)");
    },
    mutationFn: update,
  });
};
