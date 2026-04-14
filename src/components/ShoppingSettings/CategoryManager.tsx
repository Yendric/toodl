import { useSnackbar } from "notistack";
import { type FC } from "react";
import { useCategoryDestroy, useCategoryIndexSuspense, useCategoryStore } from "../../api/generated/toodl";
import EntityManager from "./EntityManager";

const CategoryManager: FC = () => {
  const { data: categories, refetch } = useCategoryIndexSuspense();
  const createCategoryMutation = useCategoryStore();
  const deleteCategoryMutation = useCategoryDestroy();
  const { enqueueSnackbar } = useSnackbar();

  const handleAdd = (name: string, reset: () => void) => {
    createCategoryMutation.mutate(
      { data: { name } },
      {
        onSuccess: () => {
          void enqueueSnackbar("Categorie toegevoegd", { variant: "success" });
          reset();
          void refetch();
        },
        onError: () => void enqueueSnackbar("Fout bij toevoegen categorie", { variant: "error" }),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutate(
      { categoryId: id },
      {
        onSuccess: () => {
          void enqueueSnackbar("Categorie verwijderd", { variant: "success" });
          void refetch();
        },
        onError: () => void enqueueSnackbar("Fout bij verwijderen categorie", { variant: "error" }),
      },
    );
  };

  return (
    <EntityManager
      title="Categorieën"
      label="Nieuwe categorie"
      items={categories.map((c) => ({ id: c.id, name: c.name }))}
      onAdd={handleAdd}
      onDelete={handleDelete}
      isAdding={createCategoryMutation.status === "pending"}
    />
  );
};

export default CategoryManager;
