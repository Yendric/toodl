import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthState";
import { index } from "./api";

export const useLists = () => {
  const { isLoading } = useAuth();

  return useQuery({
    queryKey: ["lists"],
    queryFn: () => index(),
    enabled: !isLoading,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
