import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";
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

export const CurrentListContext = createContext<CurrentList | undefined>(undefined);

export const CurrentListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentListId = Number(searchParams.get("list"));

  const [list, setList] = useState<LocalList>();

  const { data: lists, isSuccess: isListSuccess } = useLists();
  const { data: todos, isSuccess: isTodoSuccess } = useTodos();
  const [listTodos, setListTodos] = useState<LocalTodo[]>([]);
  const deleteTodoMutation = useDestroyTodo();

  useEffect(() => {
    if (isTodoSuccess && list != undefined) setListTodos(todos.filter((todo) => todo.listId === list.id));
  }, [todos, list]);

  function destroyCompleted() {
    if (isTodoSuccess && list != undefined)
      listTodos.filter((todo) => todo.done).map((todo) => deleteTodoMutation.mutate(todo));
  }

  useEffect(() => {
    if (!isListSuccess) return;

    if (currentListId && lists.find((find) => find.id === currentListId)) {
      setList(lists.find((find) => find.id === currentListId));
    } else {
      setList(lists[0]);
      setSearchParams({ list: lists[0].id.toString() });
    }
  }, [lists, currentListId]);

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
