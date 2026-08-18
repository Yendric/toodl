import { Box, Paper, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { useMemo, type FC } from "react";
import type { CategoryResponse, StoreCategoryOrderResponse, TodoResponse } from "../../api/generated/model";
import { useCategoryIndexSuspense, useStoreGetOrderSuspense } from "../../api/generated/toodl";
import TodoRow from "./TodoRow";

const GroupedList: FC<{
  categories: CategoryResponse[];
  grouped: Record<number | "null", TodoResponse[]>;
  storeOrder?: StoreCategoryOrderResponse[];
}> = ({ categories, grouped, storeOrder }) => {
  const categoriesMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  // Valt terug op de categorienaam uit de todo zelf voor categorieën van andere lijstdeelnemers
  const groupNames = useMemo(() => {
    const names = new Map<number, string>();
    for (const key of Object.keys(grouped)) {
      if (key === "null") continue;
      const id = Number(key);
      names.set(id, categoriesMap.get(id)?.name || grouped[id]?.[0]?.categoryName || "");
    }
    return names;
  }, [grouped, categoriesMap]);

  const sortedCategoryIds = useMemo(() => {
    const existingIds = Object.keys(grouped)
      .map((k) => (k === "null" ? null : Number(k)))
      .filter((id): id is number | null => id !== null);

    const idsInOrder = storeOrder
      ? [...storeOrder].sort((a, b) => a.position - b.position).map((o) => o.categoryId)
      : [];

    const sorted = (existingIds as number[]).sort((a, b) => {
      if (storeOrder) {
        const posA = idsInOrder.indexOf(a);
        const posB = idsInOrder.indexOf(b);
        if (posA !== -1 && posB !== -1) return posA - posB;
        if (posA !== -1) return -1;
        if (posB !== -1) return 1;
      }
      const nameA = groupNames.get(a) || "";
      const nameB = groupNames.get(b) || "";
      return nameA.localeCompare(nameB);
    });

    const result: (number | null)[] = [...sorted];
    if (grouped["null"] && grouped["null"].length > 0) result.push(null);
    return result;
  }, [grouped, storeOrder, groupNames]);

  return (
    <>
      {sortedCategoryIds.map((catId) => {
        const todos = grouped[catId === null ? "null" : catId];
        return (
          <Box key={catId ?? "null"} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ ml: 1, mb: 1, color: "text.secondary", fontWeight: "bold" }}>
              {(catId !== null && groupNames.get(catId)) || "Geen categorie"}
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableBody>
                  {todos!.map((todo) => (
                    <TodoRow key={todo.id} todo={todo} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </>
  );
};

const OrderedShoppingList: FC<{
  categories: CategoryResponse[];
  grouped: Record<number | "null", TodoResponse[]>;
  selectedStoreId: number;
}> = ({ categories, grouped, selectedStoreId }) => {
  const { data: storeOrder } = useStoreGetOrderSuspense(selectedStoreId);
  return <GroupedList categories={categories} grouped={grouped} storeOrder={storeOrder} />;
};

const ShoppingTodoTable: FC<{ activeTodos: TodoResponse[]; selectedStoreId: number | "" }> = ({
  activeTodos,
  selectedStoreId,
}) => {
  const { data: categories } = useCategoryIndexSuspense();

  const grouped = useMemo(() => {
    const groups: Record<number | "null", TodoResponse[]> = { null: [] };
    activeTodos.forEach((todo) => {
      const catId = todo.categoryId || "null";
      if (!groups[catId]) groups[catId] = [];
      groups[catId].push(todo);
    });
    return groups;
  }, [activeTodos]);

  if (selectedStoreId !== "") {
    return <OrderedShoppingList categories={categories} grouped={grouped} selectedStoreId={selectedStoreId} />;
  }

  return <GroupedList categories={categories} grouped={grouped} />;
};

export default ShoppingTodoTable;
