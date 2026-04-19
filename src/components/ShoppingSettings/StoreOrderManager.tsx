import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragIndicator } from "@mui/icons-material";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { CSSProperties, useRef, useState, type FC } from "react";
import {
  useCategoryIndexSuspense,
  useStoreGetOrderSuspense,
  useStoreUpdateOrder,
} from "../../api/generated/toodl";
import { triggerHaptic } from "../../helpers/haptic";

interface SortableCategoryItemProps {
  id: number;
  name: string;
  isOverlay?: boolean;
}

const SortableCategoryItem: FC<SortableCategoryItemProps> = ({ id, name, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging || isOverlay ? 99 : 1,
    position: "relative",
    backgroundColor: isDragging || isOverlay ? "var(--mui-palette-background-paper)" : "inherit",
    touchAction: "none",
  };

  const draggingStyles: CSSProperties = isDragging || isOverlay
    ? {
        transform: isOverlay ? "scale(1.03)" : `${CSS.Transform.toString(transform)} scale(1.03)`,
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        opacity: 1,
      }
    : {};

  return (
    <ListItem
      ref={setNodeRef}
      style={{ ...style, ...draggingStyles }}
      {...attributes}
      {...listeners}
      sx={{
        borderBottom: (isDragging || isOverlay) ? "none" : "1px solid",
        borderColor: "divider",
        cursor: (isDragging || isOverlay) ? "grabbing" : "grab"
      }}
    >
      <ListItemIcon>
        <DragIndicator />
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
};

const StoreOrderManager: FC<{ storeId: number }> = ({ storeId }) => {
  const { data: initialOrder, refetch: refetchOrder } = useStoreGetOrderSuspense(storeId);
  const { data: categories } = useCategoryIndexSuspense();
  const updateOrderMutation = useStoreUpdateOrder();
  const { enqueueSnackbar } = useSnackbar();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [listWidth, setListWidth] = useState<number | undefined>(undefined);
  const listRef = useRef<HTMLUListElement>(null);

  const [order, setOrder] = useState<number[]>(() => {
    const existingCategoryIds = [...initialOrder]
      .sort((a, b) => a.position - b.position)
      .map((o) => o.categoryId);
    const allCategoryIds = categories.map((c) => c.id);
    const missingCategoryIds = allCategoryIds.filter((id) => !existingCategoryIds.includes(id));
    return [...existingCategoryIds, ...missingCategoryIds];
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
    if (listRef.current) {
      setListWidth(listRef.current.clientWidth);
    }
    triggerHaptic();
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as number);
    const newIndex = order.indexOf(over.id as number);

    const newOrder = arrayMove(order, oldIndex, newIndex);
    setOrder(newOrder);

    updateOrderMutation.mutate(
      {
        storeId,
        data: newOrder.map((categoryId, index) => ({ categoryId, position: index })),
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

  const activeCategory = categories.find((c) => c.id === activeId);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Categorie volgorde</Typography>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <List ref={listRef}>
              {order.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return (
                  <SortableCategoryItem
                    key={categoryId}
                    id={categoryId}
                    name={category?.name || `Categorie ${categoryId}`}
                  />
                );
              })}
            </List>
          </SortableContext>
          <DragOverlay>
            {activeId && activeCategory ? (
              <List sx={{ backgroundColor: "background.paper", boxShadow: 3, width: listWidth }}>
                <SortableCategoryItem id={activeId} name={activeCategory.name} isOverlay />
              </List>
            ) : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  );
};

export default StoreOrderManager;
