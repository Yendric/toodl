import ITodo from "../../types/ITodo";
import api from "../api";

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
    };
  });
}

export async function create(todo: Omit<ITodo, "id">) {
  return (await api.post<ITodo>("/todos", todo)).data;
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
