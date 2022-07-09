import { useSnackbar } from "notistack";
import { createContext, useContext, useState, FC, useEffect, ReactNode } from "react";
import IList from "../types/IList";
import ITodo from "../types/ITodo";
import { useList } from "./ListState";
import { useTodo } from "./TodoState";
type CurrentList = {
  list: IList | undefined;
  todos: ITodo[];
  setList: (value: IList) => void;
  destroyCompleted: (notification?: boolean) => void;
};

export const CurrentListContext = createContext<CurrentList | undefined>(undefined);

export const CurrentListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { lists } = useList();
  const [currentList, setList] = useState<IList>();
  const { todos: allTodos, destroy } = useTodo();
  const { enqueueSnackbar } = useSnackbar();

  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    if (!currentList || !lists.find((list) => list.id === currentList?.id)) {
      setList(lists[0]);
    } else {
      setList(lists.find((list) => list.id === currentList?.id));
    }
  }, [lists]);

  useEffect(() => {
    if (!currentList) return;
    setTodos(allTodos.filter((todo) => todo.listId === currentList.id));
  }, [allTodos, currentList]);

  function destroyCompleted(notification = true) {
    todos.filter((todo) => todo.done).forEach((todo) => destroy(todo, false));
    notification && enqueueSnackbar("Voltooide todos verwijderd");
  }

  return (
    <CurrentListContext.Provider
      value={{
        list: currentList,
        todos,
        setList,
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
