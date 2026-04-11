import { createContext, useContext, useMemo, type FC, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import type { ListResponse } from "../api/generated/model";
import { useListIndexSuspense } from "../api/generated/toodl";

type CurrentList = {
  list: ListResponse | undefined;
  currentListId: number;
};

export const CurrentListContext = createContext<CurrentList | undefined>(undefined);

export const CurrentListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const currentListId = Number(searchParams.get("list")) || 0;

  const { data: lists } = useListIndexSuspense();

  const list = useMemo(() => {
    return lists.find((l: ListResponse) => l.id === currentListId);
  }, [lists, currentListId]);

  return (
    <CurrentListContext.Provider
      value={{
        list,
        currentListId,
      }}
    >
      {children}
    </CurrentListContext.Provider>
  );
};

export function useCurrentList(): CurrentList {
  const context = useContext(CurrentListContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
