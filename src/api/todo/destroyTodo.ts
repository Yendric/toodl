import { useMutation, useQueryClient } from "@tanstack/react-query";
import ITodo from "../../types/ITodo";
import { destroyLocal } from "../offlineHelpers";
import { destroy } from "./api";

export const useDestroyTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["destroyTodo"],
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["todos"]);
      destroyLocal<ITodo>(payload, queryClient, ["todos"]);
    },
    onSuccess: () => {
      console.log("[SYNC] Todo gesynchroniseerd met server (DESTROY)");
    },
    mutationFn: destroy,
  });
};
