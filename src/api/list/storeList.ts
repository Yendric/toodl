import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import IList from "../../types/IList";
import { createLocal } from "../offlineHelpers";
import { sortFn, store } from "./api";

export const useStoreList = () => {
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ["storeList"],
    onMutate: async (payload: Omit<IList, "id">) => {
      await queryClient.cancelQueries(["lists"]);
      const localList = createLocal<IList>(payload, queryClient, ["lists"], sortFn);

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
