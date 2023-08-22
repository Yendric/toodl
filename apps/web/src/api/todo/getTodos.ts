import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthState";
import { index } from "./api";

export const useTodos = () => {
  const { isLoading } = useAuth();

  return useQuery({
    queryKey: ["todos"],
    queryFn: () => index(),
    enabled: !isLoading,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
