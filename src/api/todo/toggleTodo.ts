import { useMutation, useQueryClient } from "@tanstack/react-query";
import ITodo from "../../types/ITodo";
import { updateLocal } from "../offlineHelpers";
import { sortFn, toggle } from "./api";

export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["todos"]);
      updateLocal<ITodo>({ ...payload, done: !payload.done }, queryClient, ["todos"], sortFn);
    },
    onSuccess: () => {
      console.log("[SYNC] Todo gesynchroniseerd met server (UPDATE)");
    },
    mutationFn: toggle,
  });
};
