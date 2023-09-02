import { queryClient } from "../../queryClient";
import IList from "../../types/IList";
import api from "../api";
import { updateLocalId } from "../offlineHelpers";

export function sortFn(a: IList, b: IList) {
  return a.name.localeCompare(b.name);
}

export async function index() {
  return (await api<IList[]>("/lists")).data.map((list) => ({ ...list, localId: list.id }));
}

export async function store(list: IList) {
  const createdList = (await api.post<IList>("/lists", list)).data;

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
    // Verkrijg alle mutaties van lijsten (deze hebben de color property - ik weet het, lelijke manier)
    .filter((mutation) => mutation.state.variables?.id === list.id)
    .forEach((mutation) =>
      // Verander het tijdelijke id van deze mutatie naar het nieuwe ID van deze zonet aangemaakte lijst
      mutation.setState({
        ...mutation.state,
        variables: { ...mutation.state.variables, id: createdList.id },
      }),
    );

  // Update de local lijst met het nieuwe id
  updateLocalId<IList>(list.id, createdList.id, queryClient, ["lists"], sortFn);

  return createdList;
}

export async function update(list: IList) {
  return (await api.post(`/lists/${list.id}`, list)).data;
}

export async function destroy(list: IList) {
  await api.delete(`/lists/${list.id}`);
}
