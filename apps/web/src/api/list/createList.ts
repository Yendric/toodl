import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import IList from "../../types/IList";
import { createLocal, updateLocalId } from "../offlineHelpers";
import { create, sortFn } from "./api";

export const useCreateList = () => {
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    onMutate: async (payload: Omit<IList, "id">) => {
      await queryClient.cancelQueries(["lists"]);
      const localList = createLocal<IList>(payload, queryClient, ["lists"], sortFn);

      // Vertel de mutation wat het tijdelijke local id is
      const mutation = queryClient.getMutationCache().getAll().at(-1);
      /* @ts-ignore */
      mutation?.setState({ ...mutation.state, variables: { ...mutation.state.variables, id: localList.id } });

      enqueueSnackbar("Lijst aangemaakt");
    },
    onSuccess: () => {
      console.log("[SYNC] Lijst gesynchroniseerd met server (CREATE)");
    },
    mutationFn: async (list: IList) => {
      const createdList = await create(list);

      // Update alle todo mutaties met betrekking tot deze lijst
      queryClient
        .getMutationCache()
        .getAll()
        /* @ts-ignore */
        // Verkrijg alle mutaties van todos met deze lijst als parent. 'list.id' is het tijdelijke id van de locallist, wat in 'onMutate' aan de mutation werd toegevoegd'
        .filter((mutation) => mutation.state.variables?.listId === list.id)
        .forEach((mutation) =>
          /* @ts-ignore */
          // Verander het listId van deze todo naar het nieuwe ID van deze zonet aangemaakte lijst
          mutation.setState({ ...mutation.state, variables: { ...mutation.state.variables, listId: createdList.id } }),
        );

      // Update alle mutaties met betrekking tot deze lijst
      queryClient
        .getMutationCache()
        .getAll()
        /* @ts-ignore */
        // Verkrijg alle mutaties van lijsten (deze hebben de color property - ik weet het, lelijke manier)
        .filter((mutation) => mutation.state.variables?.id === list.id)
        .forEach((mutation) =>
          // Verander het tijdelijke id van deze mutatie naar het nieuwe ID van deze zonet aangemaakte lijst
          mutation.setState({
            ...mutation.state,
            /* @ts-ignore */
            variables: { ...mutation.state.variables, id: createdList.id },
          }),
        );

      // Update de local lijst met het nieuwe id
      updateLocalId<IList>(list.id, createdList.id, queryClient, ["lists"], sortFn);

      return createdList;
    },
  });
};
