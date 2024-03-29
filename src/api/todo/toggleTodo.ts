import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LocalTodo } from "../../types/Todo";
import { updateLocal } from "../offlineHelpers";
import { sortFn, toggle } from "./api";

export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggleTodo"],
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["todos"]);
      updateLocal<LocalTodo>({ ...payload, done: !payload.done }, queryClient, ["todos"], sortFn);
    },
    onSuccess: () => {
      console.log("[SYNC] Todo gesynchroniseerd met server (UPDATE)");
    },
    mutationFn: toggle,
  });
};
