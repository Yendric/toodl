import { createContext, useContext, useEffect, useMemo, type FC, type ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import type { ListResponse, TodoResponse } from "../api/generated/model";
import { useListIndex, useTodoDestroy, useTodoGetByList } from "../api/generated/toodl";

type CurrentList = {
  list: ListResponse | undefined;
  listTodos: TodoResponse[];
  destroyCompleted: () => void;
};

export const CurrentListContext = createContext<CurrentList | undefined>(undefined);

export const CurrentListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isTodosRoute = location.pathname === "/todos";

  const currentListId = Number(searchParams.get("list"));

  const { data: listsResult, isSuccess: isListSuccess } = useListIndex();
  const lists = listsResult?.data || [];

  const { data: todosResult, isSuccess: isTodoSuccess } = useTodoGetByList(currentListId, undefined, {
    query: {
      enabled: !!currentListId && isListSuccess,
    },
  });
  const listTodos = todosResult?.data || [];

  const deleteTodoMutation = useTodoDestroy();

  const list = useMemo(() => {
    if (!isListSuccess) return undefined;
    return lists.find((l) => l.id === currentListId);
  }, [lists, currentListId, isListSuccess]);

  function destroyCompleted() {
    if (isTodoSuccess && list != undefined) {
      listTodos
        .filter((todo) => todo.done)
        .forEach((todo) => deleteTodoMutation.mutate({ todoId: todo.id }));
    }
  }

  useEffect(() => {
    if (isListSuccess && searchParams.get("list") === null && isTodosRoute && lists.length > 0) {
      setSearchParams({ list: lists[0]!.id.toString() });
    }
  }, [lists, isListSuccess, searchParams, isTodosRoute, setSearchParams]);

  return (
    <CurrentListContext.Provider
      value={{
        list,
        listTodos,
        destroyCompleted,
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
