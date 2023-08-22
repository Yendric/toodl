import IList from "../../types/IList";
import api from "../api";

export function sortFn(a: IList, b: IList) {
  return a.name.localeCompare(b.name);
}

export async function index() {
  return (await api<IList[]>("/lists")).data;
}

export async function create(list: Omit<IList, "id">) {
  return (await api.post<IList>("/lists", list)).data;
}

export async function update(list: IList) {
  return (await api.post(`/lists/${list.id}`, list)).data;
}

export async function destroy(list: IList) {
  await api.delete(`/lists/${list.id}`);
}
