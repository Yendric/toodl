import { queryClient } from "../../queryClient";
import { LocalTodo, Todo, UnstoredTodo } from "../../types/Todo";
import api from "../api";
import { updateLocalId } from "../offlineHelpers";

export function sortFn(a: Todo, b: Todo) {
  return a.startTime.valueOf() - b.startTime.valueOf();
}

export async function index() {
  const { data: todos } = await api<Todo[]>("/todos");

  return todos.map(function (todo) {
    return {
      ...todo,
      startTime: new Date(todo.startTime),
      endTime: todo.endTime && new Date(todo.endTime),
      localId: todo.id,
    };
  });
}

export async function store(todo: LocalTodo | UnstoredTodo) {
  if (!("id" in todo)) {
    const errorMessage = `Er is iets foutgegaan bij het synchroniseren van een todo.
    Todo info: '${JSON.stringify(todo)}'`;

    alert(errorMessage);
    console.error(errorMessage);

    return;
  }

  const createdTodo = (await api.post<Todo>("/todos", todo)).data;

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
  updateLocalId<LocalTodo>(todo.id, createdTodo.id, queryClient, ["todos"], sortFn);
  return createdTodo;
}

export async function update(todo: LocalTodo) {
  return (await api.post<Todo>(`/todos/${todo.id}`, todo)).data;
}

export async function destroy(todo: LocalTodo) {
  await api.delete(`/todos/${todo.id}`);
}

export async function toggle(todo: LocalTodo) {
  return await update({ ...todo, done: !todo.done });
}
