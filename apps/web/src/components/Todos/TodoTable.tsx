import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { generateKeyBetween } from "fractional-indexing";
import { useMemo, useState, type FC } from "react";
import { useTodoDestroy, useTodoGetByListSuspense, useTodoUpdate } from "../../api/generated/toodl";
import { useCurrentList } from "../../context/CurrentListState";
import CreateTodoForm from "./CreateTodoForm";
import DestroyCompletedModal from "./DestroyCompletedModal";
import TodoRow from "./TodoRow";

const TodoTable: FC = () => {
  const { list, currentListId } = useCurrentList();
  const { data: listTodos = [] } = useTodoGetByListSuspense(currentListId);
  const deleteTodoMutation = useTodoDestroy();
  const updateTodoMutation = useTodoUpdate();

  const [destroyCompletedModalOpen, setDestroyCompletedModalOpen] = useState(false);

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
        <Box sx={{ mb: 2 }}>
          <Button
            sx={{ float: "left" }}
            disabled={completedTodos.length === 0}
            onClick={() => setDestroyCompletedModalOpen(true)}
            variant="contained"
          >
            Verwijder voltooid
          </Button>
          <Typography sx={{ float: "right" }}>Onvoltooid: {activeTodos.length}</Typography>
        </Box>
        <CreateTodoForm />
        <Container sx={{ p: 0 }} maxWidth="md">
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
                            <TodoRow
                              todo={todo}
                              provided={provided}
                              isDragging={snapshot.isDragging}
                            />
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
