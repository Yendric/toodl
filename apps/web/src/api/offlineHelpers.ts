import { QueryClient } from "@tanstack/react-query";

interface BaseType {
  id: number;
  localId: number;
}

export function createLocal<T extends BaseType>(
  newItem: Omit<T, "id" | "localId">,
  queryClient: QueryClient,
  queryKey: string[],
  sortFn: (a: T, b: T) => number = () => 0,
) {
  const id = Date.now();
  const newItemWithId = { ...newItem, id: id, localId: id } as T;
  queryClient.setQueryData<T[]>(queryKey, (old) => {
    return [...(old ?? []), newItemWithId].sort(sortFn);
  });

  return newItemWithId;
}

export function updateLocal<T extends BaseType>(
  updateItem: T,
  queryClient: QueryClient,
  queryKey: string[],
  sortFn: (a: T, b: T) => number = () => 0,
) {
  queryClient.setQueryData<T[]>(queryKey, (old) => {
    return old
      ?.map((item) => {
        if (item.id === updateItem.id) {
          return updateItem;
        }
        return item;
      })
      .sort(sortFn);
  });
}

export function updateLocalId<T extends BaseType>(
  oldId: number,
  newId: number,
  queryClient: QueryClient,
  queryKey: string[],
  sortFn: (a: T, b: T) => number = () => 0,
) {
  queryClient.setQueryData<T[]>(queryKey, (old) => {
    return old
      ?.map((item) => {
        if (item.id === oldId) {
          return { ...item, id: newId };
        }
        return item;
      })
      .sort(sortFn);
  });
}

export function destroyLocal<T extends BaseType>(destroyItem: T, queryClient: QueryClient, queryKey: string[]) {
  queryClient.setQueryData<T[]>(queryKey, (old) => {
    return old?.filter((item) => item.id !== destroyItem.id);
  });
}
