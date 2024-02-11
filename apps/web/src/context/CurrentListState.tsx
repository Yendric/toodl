import { FC, ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLists } from "../api/list/getLists";
import { useDestroyTodo } from "../api/todo/destroyTodo";
import { useTodos } from "../api/todo/getTodos";
import { LocalList } from "../types/List";
import { LocalTodo } from "../types/Todo";

type CurrentList = {
  list: LocalList | undefined;
  listTodos: LocalTodo[];
  destroyCompleted: () => void;
};

type ListData = {
  id: number;
  list: LocalList;
  todos: LocalTodo[];
};

export const CurrentListContext = createContext<CurrentList | undefined>(undefined);

export const CurrentListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentListId = Number(searchParams.get("list"));

  const { data: lists, isSuccess: isListSuccess } = useLists();
  const { data: todos, isSuccess: isTodoSuccess } = useTodos();
  const deleteTodoMutation = useDestroyTodo();

  console.log("rerender");

  const list = useMemo(() => {
    if (!isListSuccess || !isTodoSuccess) return;

    const list = lists.find((find) => find.id === currentListId);

    if (!list) return undefined;
    return {
      id: currentListId,
      list,
      todos: todos.filter((todo) => todo.listId === list.id),
    };
  }, [lists, todos, currentListId]);

  function destroyCompleted() {
    if (isTodoSuccess && list != undefined)
      list.todos.filter((todo) => todo.done).map((todo) => deleteTodoMutation.mutate(todo));
  }

  useEffect(() => {
    if (isListSuccess && searchParams.get("list") == undefined) {
      setSearchParams({ list: lists[0].id.toString() });
    }
  }, [lists, currentListId]);

  return (
    <CurrentListContext.Provider
      value={{
        list: list?.list,
        listTodos: list?.todos || [],
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
