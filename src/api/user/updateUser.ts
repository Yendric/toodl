import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { update } from "./api";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      enqueueSnackbar("Profiel geüpdatet");
    },
    mutationFn: update,
  });
};
