import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updatePassword } from "./api";

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      enqueueSnackbar("Wachtwoord geüpdatet");
    },
    mutationFn: updatePassword,
  });
};
