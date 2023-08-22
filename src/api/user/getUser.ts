import { useQuery } from "@tanstack/react-query";
import { info } from "./api";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => info(),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
