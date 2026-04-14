import { Box, Container, Typography } from "@mui/material";
import { type FC } from "react";
import { useTodoTableState } from "../../hooks/useTodoTableState";
import CompletedTodoTable from "./CompletedTodoTable";
import CreateTodoForm from "./CreateTodoForm";
import DestroyCompletedModal from "./DestroyCompletedModal";
import RegularTodoTable from "./RegularTodoTable";
import ShoppingTodoTable from "./ShoppingTodoTable";
import TodoTableHeader from "./TodoTableHeader";

const TodoTable: FC = () => {
  const {
    list,
    activeTodos,
    completedTodos,
    selectedStoreId,
    setSelectedStoreId,
    destroyCompletedModalOpen,
    setDestroyCompletedModalOpen,
    handleDragEnd,
    destroyCompleted,
  } = useTodoTableState();

  if (list == undefined) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">Geen lijst geselecteerd</Typography>
        <Typography variant="body2" color="text.secondary">
          Maak een nieuwe lijst aan in de zijbalk om te beginnen.
        </Typography>
      </Box>
    );
  }

  const isShoppingList = list.type === "SHOPPING";

  return (
    <>
      <DestroyCompletedModal
        visible={destroyCompletedModalOpen}
        onDismissed={() => setDestroyCompletedModalOpen(false)}
        destroyCompleted={destroyCompleted}
      />

      <Box component="main" sx={{ p: 2, flexGrow: 1, width: "100%" }}>
        <TodoTableHeader
          activeCount={activeTodos.length}
          completedCount={completedTodos.length}
          isShoppingList={isShoppingList}
          selectedStoreId={selectedStoreId}
          onStoreChange={setSelectedStoreId}
          onDestroyCompleted={() => setDestroyCompletedModalOpen(true)}
        />

        <CreateTodoForm activeTodos={activeTodos} />

        <Container sx={{ p: 0 }} maxWidth="md">
          {isShoppingList ? (
            <ShoppingTodoTable activeTodos={activeTodos} selectedStoreId={selectedStoreId} />
          ) : (
            <RegularTodoTable activeTodos={activeTodos} onDragEnd={handleDragEnd} />
          )}

          <CompletedTodoTable completedTodos={completedTodos} />
        </Container>
      </Box>
    </>
  );
};

export default TodoTable;
