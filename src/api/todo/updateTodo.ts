import { useMutation, useQueryClient } from "@tanstack/react-query";
import ITodo from "../../types/ITodo";
import { updateLocal } from "../offlineHelpers";
import { sortFn, update } from "./api";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTodo"],
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["todos"]);
      updateLocal<ITodo>(payload, queryClient, ["todos"], sortFn);
    },
    onSuccess: () => {
      console.log("[SYNC] Todo gesynchroniseerd met server (UPDATE)");
    },
    mutationFn: update,
  });
};
