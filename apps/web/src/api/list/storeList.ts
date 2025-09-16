import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { type LocalList, type UnstoredList } from "../../types/List";
import { createLocal } from "../offlineHelpers";
import { sortFn, store } from "./api";

export const useStoreList = () => {
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ["storeList"],
    onMutate: async (payload: UnstoredList) => {
      await queryClient.cancelQueries(["lists"]);
      const localList = createLocal<LocalList>(payload, queryClient, ["lists"], sortFn);

      // Vertel de mutation wat het tijdelijke local id is
      const mutation = queryClient.getMutationCache().getAll().at(-1);
      mutation?.setState({ ...mutation.state, variables: { ...mutation.state.variables, id: localList.id } });

      enqueueSnackbar("Lijst aangemaakt");
    },
    onSuccess: () => {
      console.log("[SYNC] Lijst gesynchroniseerd met server (CREATE)");
    },
    mutationFn: store,
  });
};
