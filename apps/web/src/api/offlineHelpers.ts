import { QueryClient } from "@tanstack/react-query";

export function createLocal<T extends {}>(
  newItem: Omit<T, "id">,
  queryClient: QueryClient,
  queryKey: string[],
  sortFn: (a: T, b: T) => number = () => 0,
) {
  /* @ts-ignore */
  const newItemWithId = { ...newItem, id: Date.now() } as T;
  queryClient.setQueryData<T[]>(queryKey, (old) => {
    return [...(old ?? []), newItemWithId].sort(sortFn);
  });

  return newItemWithId;
}

export function updateLocal<T extends Record<string, any>>(
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

export function updateLocalId<T extends Record<string, any>>(
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

export function destroyLocal<T extends Record<string, any>>(
  destroyItem: T,
  queryClient: QueryClient,
  queryKey: string[],
) {
  queryClient.setQueryData<T[]>(queryKey, (old) => {
    return old?.filter((item) => item.id !== destroyItem.id);
  });
}
