import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthState";
import { destroy } from "./api";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      logout();
      enqueueSnackbar("Account succesvol verwijderd.");
      navigate("/login");
    },
    mutationFn: destroy,
  });
};
