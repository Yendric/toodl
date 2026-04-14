import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import TodoRow from "./TodoRow";

interface Props {
  activeTodos: TodoResponse[];
  onDragEnd: (result: DropResult) => void;
}

const RegularTodoTable: FC<Props> = ({ activeTodos, onDragEnd }) => {
  return (
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
  );
};

export default RegularTodoTable;
