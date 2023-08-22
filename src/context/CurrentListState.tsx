import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useLists } from "../api/list/getLists";
import { useDeleteTodo } from "../api/todo/destroyTodo";
import { useTodos } from "../api/todo/getTodos";
import IList from "../types/IList";
import ITodo from "../types/ITodo";

type CurrentList = {
  list: IList | undefined;
  listTodos: ITodo[];
  destroyCompleted: () => void;
  setList: (value: IList) => void;
};

export const CurrentListContext = createContext<CurrentList | undefined>(undefined);

export const CurrentListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [list, setList] = useState<IList>();

  const { data: lists, isSuccess: isListSuccess } = useLists();
  const { data: todos, isSuccess: isTodoSuccess } = useTodos();
  const [listTodos, setListTodos] = useState<ITodo[]>([]);
  const deleteTodoMutation = useDeleteTodo();

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
