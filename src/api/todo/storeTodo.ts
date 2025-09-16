import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add } from "date-fns";
import { type LocalTodo, type UnstoredTodo } from "../../types/Todo";
import { createLocal } from "../offlineHelpers";
import { sortFn, store } from "./api";

export const useStoreTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["storeTodo"],
    onMutate: async (todo: UnstoredTodo) => {
      await queryClient.cancelQueries(["todos"]);

      // Onderstaande logica gebeurt ook op de server en moeten we dus op de client nabootsen
      todo.endTime ??= add(todo.startTime, { hours: 1 });

      const localTodo = createLocal<LocalTodo>(todo, queryClient, ["todos"], sortFn);

      // Vertel de mutation wat het tijdelijke local id is
      const mutation = queryClient.getMutationCache().getAll().at(-1);
      mutation?.setState({ ...mutation.state, variables: { ...mutation.state.variables, id: localTodo.id } });
    },
    onSuccess: () => {
      console.log("[SYNC] Todo gesynchroniseerd met server (CREATE)");
    },
    mutationFn: store,
  });
};
