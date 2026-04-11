import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { generateKeyBetween } from "fractional-indexing";
import { Suspense, useMemo, useState, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import {
  useCategoryIndexSuspense,
  useStoreGetOrderSuspense,
  useStoreIndexSuspense,
  useTodoDestroy,
  useTodoGetByListSuspense,
  useTodoUpdate,
} from "../../api/generated/toodl";
import { useCurrentList } from "../../context/CurrentListState";
import CreateTodoForm from "./CreateTodoForm";
import DestroyCompletedModal from "./DestroyCompletedModal";
import TodoRow from "./TodoRow";

const StoreSelect: FC<{ selectedStoreId: number | ""; onStoreChange: (id: number | "") => void }> = ({
  selectedStoreId,
  onStoreChange,
}) => {
  const { data: stores } = useStoreIndexSuspense();

  return (
    <Select
      size="small"
      value={selectedStoreId}
      onChange={(e) => onStoreChange(e.target.value as number | "")}
      displayEmpty
      sx={{ ml: 1, minWidth: 120 }}
    >
      <MenuItem value="">
        <em>Geen winkel</em>
      </MenuItem>
      {stores.map((store) => (
        <MenuItem key={store.id} value={store.id}>
          {store.name}
        </MenuItem>
      ))}
    </Select>
  );
};

const OrderedGroupedActiveTodos: FC<{
  listTodos: TodoResponse[];
  selectedStoreId: number;
  categories: any[];
  grouped: Record<number | "null", TodoResponse[]>;
}> = ({ listTodos, selectedStoreId, categories, grouped }) => {
  const { data: storeOrder } = useStoreGetOrderSuspense(selectedStoreId);
  const sortedStoreOrder = [...storeOrder].sort((a, b) => a.position - b.position);

  const sortedCategoryIds = useMemo(() => {
    const idsInOrder = sortedStoreOrder.map((o) => o.categoryId);
    const existingIds = Object.keys(grouped)
      .map((k) => (k === "null" ? (null as unknown as number) : Number(k)))
      .filter((id) => id !== null);

    // Sort existing categories based on store order, then by name for those not in store order
    const sorted = existingIds.sort((a, b) => {
      const posA = idsInOrder.indexOf(a);
      const posB = idsInOrder.indexOf(b);
      if (posA !== -1 && posB !== -1) return posA - posB;
      if (posA !== -1) return -1;
      if (posB !== -1) return 1;
      const nameA = categories.find((c) => c.id === a)?.name || "";
      const nameB = categories.find((c) => c.id === b)?.name || "";
      return nameA.localeCompare(nameB);
    });

    const result: (number | null)[] = [...sorted];
    if (grouped["null"].length > 0) result.push(null);
    return result;
  }, [grouped, sortedStoreOrder, categories]);

  return (
    <>
      {sortedCategoryIds.map((catId) => {
        const category = categories.find((c) => c.id === catId);
        const todos = grouped[catId === null ? "null" : catId];
        return (
          <Box key={catId === null ? "null" : (catId as number)} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ ml: 1, color: "text.secondary", fontWeight: "bold" }}>
              {category?.name || "Geen categorie"}
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

const UnorderedGroupedActiveTodos: FC<{
  categories: any[];
  grouped: Record<number | "null", TodoResponse[]>;
}> = ({ categories, grouped }) => {
  const sortedCategoryIds = useMemo(() => {
    const existingIds = Object.keys(grouped)
      .map((k) => (k === "null" ? (null as unknown as number) : Number(k)))
      .filter((id) => id !== null);

    // Sort existing categories by name
    const sorted = existingIds.sort((a, b) => {
      const nameA = categories.find((c) => c.id === a)?.name || "";
      const nameB = categories.find((c) => c.id === b)?.name || "";
      return nameA.localeCompare(nameB);
    });

    const result: (number | null)[] = [...sorted];
    if (grouped["null"].length > 0) result.push(null);
    return result;
  }, [grouped, categories]);

  return (
    <>
      {sortedCategoryIds.map((catId) => {
        const category = categories.find((c) => c.id === catId);
        const todos = grouped[catId === null ? "null" : catId];
        return (
          <Box key={catId === null ? "null" : (catId as number)} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ ml: 1, color: "text.secondary", fontWeight: "bold" }}>
              {category?.name || "Geen categorie"}
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

const GroupedActiveTodos: FC<{ listTodos: TodoResponse[]; selectedStoreId: number | "" }> = ({
  listTodos,
  selectedStoreId,
}) => {
  const { data: categories } = useCategoryIndexSuspense();

  const activeTodos = listTodos.filter((todo) => !todo.done);

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
    return (
      <OrderedGroupedActiveTodos
        listTodos={listTodos}
        selectedStoreId={selectedStoreId as number}
        categories={categories}
        grouped={grouped}
      />
    );
  }

  return <UnorderedGroupedActiveTodos categories={categories} grouped={grouped} />;
};

const TodoTable: FC = () => {
  const { list, currentListId } = useCurrentList();
  const { data: listTodos = [] } = useTodoGetByListSuspense(currentListId);
  const deleteTodoMutation = useTodoDestroy();
  const updateTodoMutation = useTodoUpdate();

  const [destroyCompletedModalOpen, setDestroyCompletedModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | "">("");

  const isShoppingList = list?.type === "SHOPPING";

  const activeTodos = useMemo(() => {
    return [...listTodos]
      .filter((todo) => !todo.done)
      .sort((a, b) => (a.position || "").localeCompare(b.position || ""));
  }, [listTodos]);

  const completedTodos = useMemo(() => {
    return listTodos.filter((todo) => todo.done);
  }, [listTodos]);

  const destroyCompleted = () => {
    completedTodos.forEach((todo) => deleteTodoMutation.mutate({ todoId: todo.id }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const movedTodo = activeTodos[sourceIndex]!;
    const newActiveTodos = [...activeTodos];
    newActiveTodos.splice(sourceIndex, 1);
    newActiveTodos.splice(destinationIndex, 0, movedTodo);

    let newPosition: string;

    try {
      if (newActiveTodos.length === 1) {
        newPosition = generateKeyBetween(null, null);
      } else if (destinationIndex === 0) {
        newPosition = generateKeyBetween(null, newActiveTodos[1]!.position || null);
      } else if (destinationIndex === newActiveTodos.length - 1) {
        newPosition = generateKeyBetween(newActiveTodos[newActiveTodos.length - 2]!.position || null, null);
      } else {
        newPosition = generateKeyBetween(
          newActiveTodos[destinationIndex - 1]!.position || null,
          newActiveTodos[destinationIndex + 1]!.position || null
        );
      }
    } catch (e) {
      // Fallback if keys are invalid or too close
      newPosition = new Date().getTime().toString();
    }

    updateTodoMutation.mutate({
      todoId: movedTodo.id,
      data: {
        subject: movedTodo.subject,
        position: newPosition,
      },
    });
  };

  if (list == undefined) {
    return (
      <Box component="main" sx={{ p: 2, width: "calc(100% - 56px)" }}>
        <Typography variant="h6">Selecteer een lijst om te beginnen</Typography>
      </Box>
    );
  }

  return (
    <>
      <DestroyCompletedModal
        visible={destroyCompletedModalOpen}
        onDismissed={() => setDestroyCompletedModalOpen(false)}
        destroyCompleted={destroyCompleted}
      />
      <Box component="main" sx={{ p: 2, width: "calc(100% - 56px)" }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Button
              disabled={completedTodos.length === 0}
              onClick={() => setDestroyCompletedModalOpen(true)}
              variant="contained"
            >
              Verwijder voltooid
            </Button>
            {isShoppingList && (
              <Suspense fallback={null}>
                <StoreSelect selectedStoreId={selectedStoreId} onStoreChange={setSelectedStoreId} />
              </Suspense>
            )}
          </Box>
          <Typography>Onvoltooid: {activeTodos.length}</Typography>
        </Box>
        <CreateTodoForm />
        <Container sx={{ p: 0 }} maxWidth="md">
          {isShoppingList ? (
            <Suspense fallback={<Typography>Laden...</Typography>}>
              <GroupedActiveTodos listTodos={listTodos} selectedStoreId={selectedStoreId} />
            </Suspense>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small" aria-label="todos">
                  {activeTodos.length === 0 && (
                    <caption>Zo te zien heb je nog geen todos in deze lijst, maak er één bovenaan!</caption>
                  )}
                  <Droppable droppableId="todos">
                    {(provided) => (
                      <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                        {activeTodos.map((todo, index) => (
                          <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <TodoRow todo={todo} provided={provided} isDragging={snapshot.isDragging} />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </Table>
              </TableContainer>
            </DragDropContext>
          )}

          {completedTodos.length > 0 && (
            <>
              <Typography variant="h6">Voltooide todos</Typography>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="voltooide todos">
                  <TableBody>
                    {completedTodos.map((todo) => (
                      <TodoRow key={todo.id} todo={todo} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default TodoTable;
