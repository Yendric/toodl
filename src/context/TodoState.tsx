import { createContext, useContext, useState, useEffect, FC } from "react";
import { useAppState } from "./AppState";
import { useSnackbar } from "notistack";
import ITodo from "../types/ITodo";
import { useSocket } from "./SocketState";

type TodoState = {
  todos: ITodo[];
  create: (todo: Omit<ITodo, "id">, notification?: boolean) => void;
  destroy: (todo: ITodo, notification?: boolean) => void;
  update: (todo: ITodo, notification?: boolean) => void;
  toggleDone: (todo: ITodo) => void;
  destroyCompleted: (notification?: boolean) => void;
};

export const TodoContext = createContext<TodoState | undefined>(undefined);

export const TodoProvider: FC = ({ children }) => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const { socket, call } = useSocket();
  const { setIsLoading } = useAppState();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!socket) return;

    setIsLoading(true);

    socket.on("connect", () => {
      socket.emit("todos");
    });

    call("todos").then((todos: ITodo[]) => {
      setTodos(todos);
      setIsLoading(false);
    });

    // Event listener voor todo changes op andere toestellen
    socket.on("todos", (todos: ITodo[]) => {
      setTodos(todos);
    });
  }, [socket]);

  /*
  / C(R)UD 
  */
  async function create(todo: Omit<ITodo, "id">, notification = true) {
    await call("todos/create", todo);
    notification && enqueueSnackbar("Todo aangemaakt");
  }

  async function update(todo: ITodo, notification = true) {
    await call("todos/update", todo);
    notification && enqueueSnackbar("Todo geüpdatet");
  }

  async function destroy(todo: ITodo, notification = true) {
    await call("todos/destroy", todo);
    notification && enqueueSnackbar("Todo verwijderd");
  }

  /*
  / Helpers 
  */
  function toggleDone(todo: ITodo) {
    update({ ...todo, done: !todo.done });
  }

  function destroyCompleted(notification = true) {
    todos.filter((todo) => todo.done).forEach((todo) => destroy(todo, false));
    notification && enqueueSnackbar("Voltooide todos verwijderd");
  }

  return (
    <TodoContext.Provider
      value={{
        todos,
        create,
        destroy,
        update,
        toggleDone,
        destroyCompleted,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export function useTodo(): TodoState {
  const context = useContext(TodoContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
