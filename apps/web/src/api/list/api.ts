import { queryClient } from "../../queryClient";
import { List, LocalList, UnstoredList } from "../../types/List";
import api from "../api";
import { updateLocalId } from "../offlineHelpers";

export function sortFn(a: LocalList, b: LocalList) {
  return a.name.localeCompare(b.name);
}

export async function index() {
  return (await api<List[]>("/lists")).data.map((list) => ({ ...list, localId: list.id }));
}

export async function store(list: LocalList | UnstoredList) {
  if (!("id" in list)) {
    const errorMessage = `Er is iets foutgegaan bij het synchroniseren van een lijst.
    Lijst info: '${JSON.stringify(list)}'`;

    alert(errorMessage);
    console.error(errorMessage);

    return;
  }

  const createdList = (await api.post<List>("/lists", list)).data;

  // Update alle todo mutaties met betrekking tot deze lijst
  queryClient
    .getMutationCache()
    .getAll()
    // Verkrijg alle mutaties van todos met deze lijst als parent. 'list.id' is het tijdelijke id van de locallist, wat in 'onMutate' aan de mutation werd toegevoegd'
    .filter((mutation) => mutation.state.variables?.listId === list.id)
    .forEach((mutation) =>
      // Verander het listId van deze todo naar het nieuwe ID van deze zonet aangemaakte lijst
      mutation.setState({ ...mutation.state, variables: { ...mutation.state.variables, listId: createdList.id } }),
    );

  // Update alle mutaties met betrekking tot deze lijst
  queryClient
    .getMutationCache()
    .getAll()
    // Verkrijg alle mutaties van lijsten
    .filter((mutation) => mutation.state.variables?.id === list.id)
    .forEach((mutation) =>
      // Verander het tijdelijke id van deze mutatie naar het nieuwe ID van deze zonet aangemaakte lijst
      mutation.setState({
        ...mutation.state,
        variables: { ...mutation.state.variables, id: createdList.id },
      }),
    );

  // Update de local lijst met het nieuwe id
  updateLocalId<LocalList>(list.id, createdList.id, queryClient, ["lists"], sortFn);

  return createdList;
}

export async function update(list: LocalList) {
  return (await api.post(`/lists/${list.id}`, list)).data;
}

export async function destroy(list: LocalList) {
  await api.delete(`/lists/${list.id}`);
}
