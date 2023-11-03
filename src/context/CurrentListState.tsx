import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useLists } from "../api/list/getLists";
import { useDestroyTodo } from "../api/todo/destroyTodo";
import { useTodos } from "../api/todo/getTodos";
import { LocalList } from "../types/List";
import { LocalTodo } from "../types/Todo";

type CurrentList = {
  list: LocalList | undefined;
  listTodos: LocalTodo[];
  destroyCompleted: () => void;
  setList: (value: LocalList) => void;
};

export const CurrentListContext = createContext<CurrentList | undefined>(undefined);

export const CurrentListProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
    if (isListSuccess && (!list || !lists.find((find) => find.id === list.id))) {
      setList(lists[0]);
    } else if (isListSuccess) {
      setList(lists.find((find) => find.id === list?.id));
    }
  }, [lists]);

  return (
    <CurrentListContext.Provider
      value={{
        list,
        listTodos,
        destroyCompleted,
        setList,
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
