import { queryClient } from "../../queryClient";
import ITodo from "../../types/ITodo";
import api from "../api";
import { updateLocalId } from "../offlineHelpers";

export function sortFn(a: ITodo, b: ITodo) {
  return a.startTime.valueOf() - b.startTime.valueOf();
}

export async function index() {
  const { data: todos } = await api<ITodo[]>("/todos");

  return todos.map(function (todo) {
    return {
      ...todo,
      startTime: new Date(todo.startTime),
      endTime: todo.endTime && new Date(todo.endTime),
      localId: todo.id,
    };
  });
}

export async function store(todo: ITodo) {
  const createdTodo = (await api.post<ITodo>("/todos", todo)).data;

  // Update alle mutaties met betrekking tot deze todo
  queryClient
    .getMutationCache()
    .getAll()
    // Verkrijg alle mutaties van deze todo
    .filter((mutation) => mutation.state.variables?.id === todo.id)
    .forEach((mutation) =>
      // Verander het tijdelijke id van deze mutatie naar het nieuwe ID van deze zonet aangemaakte lijst
      mutation.setState({
        ...mutation.state,
        variables: { ...mutation.state.variables, id: createdTodo.id },
      }),
    );

  // Update de local todo met het nieuwe id
  updateLocalId<ITodo>(todo.id, createdTodo.id, queryClient, ["todos"], sortFn);
  return createdTodo;
}

export async function update(todo: ITodo) {
  return (await api.post<ITodo>(`/todos/${todo.id}`, todo)).data;
}

export async function destroy(todo: ITodo) {
  await api.delete(`/todos/${todo.id}`);
}

export async function toggle(todo: ITodo) {
  return await update({ ...todo, done: !todo.done });
}
