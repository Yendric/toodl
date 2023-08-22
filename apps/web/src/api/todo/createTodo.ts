import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add } from "date-fns";
import ITodo from "../../types/ITodo";
import { createLocal, updateLocalId } from "../offlineHelpers";
import { create, sortFn } from "./api";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (todo: Omit<ITodo, "id">) => {
      await queryClient.cancelQueries(["todos"]);

      // Onderstaande logica gebeurt ook op de server en moeten we dus op de client nabootsen
      todo.endTime ??= add(todo.startTime, { hours: 1 });

      const localTodo = createLocal<ITodo>(todo, queryClient, ["todos"], sortFn);

      // Vertel de mutation wat het tijdelijke local id is
      const mutation = queryClient.getMutationCache().getAll().at(-1);
      /* @ts-ignore */
      mutation?.setState({ ...mutation.state, variables: { ...mutation.state.variables, id: localTodo.id } });
    },
    onSuccess: () => {
      console.log("[SYNC] Todo gesynchroniseerd met server (CREATE)");
    },
    mutationFn: async (todo: ITodo) => {
      const createdTodo = await create(todo);

      // Update alle mutaties met betrekking tot deze todo
      queryClient
        .getMutationCache()
        .getAll()
        /* @ts-ignore */
        // Verkrijg alle mutaties van deze todo
        .filter((mutation) => mutation.state.variables?.id === todo.id)
        .forEach((mutation) =>
          // Verander het tijdelijke id van deze mutatie naar het nieuwe ID van deze zonet aangemaakte lijst
          mutation.setState({
            ...mutation.state,
            /* @ts-ignore */
            variables: { ...mutation.state.variables, id: createdTodo.id },
          }),
        );

      // Update de local todo met het nieuwe id
      updateLocalId<ITodo>(todo.id, createdTodo.id, queryClient, ["todos"], sortFn);
      return createdTodo;
    },
  });
};
