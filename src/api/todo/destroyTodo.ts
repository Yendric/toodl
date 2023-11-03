import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LocalTodo } from "../../types/Todo";
import { destroyLocal } from "../offlineHelpers";
import { destroy } from "./api";

export const useDestroyTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["destroyTodo"],
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["todos"]);
      destroyLocal<LocalTodo>(payload, queryClient, ["todos"]);
    },
    onSuccess: () => {
      console.log("[SYNC] Todo gesynchroniseerd met server (DESTROY)");
    },
    mutationFn: destroy,
  });
};
