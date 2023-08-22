import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import IList from "../../types/IList";
import { updateLocal } from "../offlineHelpers";
import { sortFn, update } from "./api";

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["lists"]);
      updateLocal<IList>(payload, queryClient, ["lists"], sortFn);
      enqueueSnackbar("Lijst gewijzigd");
    },
    onSuccess: () => {
      console.log("[SYNC] Lijst gesynchroniseerd met server (UPDATE)");
    },
    mutationFn: update,
  });
};
