import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { useAppState } from "./AppState";
import { useSnackbar } from "notistack";
import ITodo from "../types/ITodo";
import { useSocket } from "./SocketState";
import Confetti from "react-confetti";
import useAxios from "../hooks/useAxios";

type TodoState = {
  todos: ITodo[];
  create: (todo: Omit<ITodo, "id">, notification?: boolean) => Promise<ITodo>;
  update: (todo: ITodo, notification?: boolean) => Promise<ITodo>;
  destroy: (todo: ITodo, notification?: boolean) => Promise<boolean>;
  toggleDone: (todo: ITodo) => void;
  destroyCompleted: (notification?: boolean) => void;
};

export const TodoContext = createContext<TodoState | undefined>(undefined);

export const TodoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const { socket } = useSocket();
  const { removeLoading, addLoading } = useAppState();
  const { enqueueSnackbar } = useSnackbar();
  const [runConfetti, setRunConfetti] = useState(false);
  const [renderConfetti, setRenderConfetti] = useState(false);

  const axios = useAxios();

  useEffect(() => {
    addLoading("todos");
    axios("/todos").then(({ data }) => {
      setTodos(data);
      removeLoading("todos");
    });

    if (!socket) return;
    // Event listener voor todo changes op andere toestellen
    socket.on("todos", (todos: ITodo[]) => {
      setTodos(todos);
    });
  }, [socket]);

  /*
  / C(R)UD 
  */
  async function create(todo: Omit<ITodo, "id">, notification = true) {
    const res = await axios.post<ITodo>("/todos", todo);
    notification && enqueueSnackbar("Todo aangemaakt");

    return res.data;
  }

  async function update(todo: ITodo, notification = true) {
    const res = await axios.post<ITodo>(`/todos/${todo.id}`, todo);
    notification && enqueueSnackbar("Todo geüpdatet");

    return res.data;
  }

  async function destroy(todo: ITodo, notification = true) {
    await axios.delete(`/todos/${todo.id}`);
    notification && enqueueSnackbar("Todo verwijderd");

    return true;
  }

  /*
  / Helpers 
  */
  function toggleDone(todo: ITodo) {
    if (!todo.done && todos.filter((ttodo) => !ttodo.done && ttodo.listId == todo.listId).length === 1) {
      setRunConfetti(true);
      setRenderConfetti(true);

      setTimeout(() => setRunConfetti(false), 2000);
      setTimeout(() => setRenderConfetti(false), 4000);
    }
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
      {renderConfetti && <Confetti run={runConfetti} recycle={false} tweenDuration={2000} />}
      {children}
    </TodoContext.Provider>
  );
};

export function useTodo(): TodoState {
  const context = useContext(TodoContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
