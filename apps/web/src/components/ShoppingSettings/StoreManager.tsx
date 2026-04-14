import { useSnackbar } from "notistack";
import { type FC } from "react";
import { useStoreDestroy, useStoreIndexSuspense, useStoreStore } from "../../api/generated/toodl";
import EntityManager from "./EntityManager";

const StoreManager: FC = () => {
  const { data: stores, refetch } = useStoreIndexSuspense();
  const createStoreMutation = useStoreStore();
  const deleteStoreMutation = useStoreDestroy();
  const { enqueueSnackbar } = useSnackbar();

  const handleAdd = (name: string, reset: () => void) => {
    createStoreMutation.mutate(
      { data: { name } },
      {
        onSuccess: () => {
          void enqueueSnackbar("Winkel toegevoegd", { variant: "success" });
          reset();
          void refetch();
        },
        onError: () => void enqueueSnackbar("Fout bij toevoegen winkel", { variant: "error" }),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteStoreMutation.mutate(
      { storeId: id },
      {
        onSuccess: () => {
          void enqueueSnackbar("Winkel verwijderd", { variant: "success" });
          void refetch();
        },
        onError: () => void enqueueSnackbar("Fout bij verwijderen winkel", { variant: "error" }),
      },
    );
  };

  return (
    <EntityManager
      title="Winkels"
      label="Nieuwe winkel"
      items={stores.map((s) => ({ id: s.id, name: s.name }))}
      onAdd={handleAdd}
      onDelete={handleDelete}
      isAdding={createStoreMutation.status === "pending"}
    />
  );
};

export default StoreManager;
