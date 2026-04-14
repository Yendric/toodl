import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { DragIndicator } from "@mui/icons-material";
import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, type FC } from "react";
import { useCategoryIndexSuspense, useStoreGetOrderSuspense, useStoreUpdateOrder } from "../../api/generated/toodl";

const StoreOrderManager: FC<{ storeId: number }> = ({ storeId }) => {
  const { data: initialOrder, refetch: refetchOrder } = useStoreGetOrderSuspense(storeId);
  const { data: categories } = useCategoryIndexSuspense();
  const updateOrderMutation = useStoreUpdateOrder();
  const { enqueueSnackbar } = useSnackbar();

  const [order, setOrder] = useState<number[]>(() => {
    const existingCategoryIds = [...initialOrder].sort((a, b) => a.position - b.position).map((o) => o.categoryId);
    const allCategoryIds = categories.map((c) => c.id);
    const missingCategoryIds = allCategoryIds.filter((id) => !existingCategoryIds.includes(id));
    return [...existingCategoryIds, ...missingCategoryIds];
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem!);

    setOrder(items);

    updateOrderMutation.mutate(
      {
        storeId,
        data: items.map((categoryId, index) => ({ categoryId, position: index })),
      },
      {
        onSuccess: () => {
          void enqueueSnackbar("Volgorde opgeslagen", { variant: "success" });
          void refetchOrder();
        },
        onError: () => void enqueueSnackbar("Fout bij opslaan volgorde", { variant: "error" }),
      },
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Categorie volgorde</Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {order.map((categoryId, index) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return (
                    <Draggable key={categoryId} draggableId={categoryId.toString()} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                        >
                          <ListItemIcon {...provided.dragHandleProps}>
                            <DragIndicator />
                          </ListItemIcon>
                          <ListItemText primary={category?.name || `Categorie ${categoryId}`} />
                        </ListItem>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default StoreOrderManager;
