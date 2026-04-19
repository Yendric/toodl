import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { useRef, useState, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { triggerHaptic } from "../../helpers/haptic";
import TodoRow from "./TodoRow";

interface Props {
  activeTodos: TodoResponse[];
  onDragEnd: (event: DragEndEvent) => void;
}

const RegularTodoTable: FC<Props> = ({ activeTodos, onDragEnd }) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [tableWidth, setTableWidth] = useState<number | undefined>(undefined);
  const tableRef = useRef<HTMLTableElement>(null);

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
    if (tableRef.current) {
      setTableWidth(tableRef.current.clientWidth);
    }
    triggerHaptic();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  const activeTodo = activeTodos.find((t) => t.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table
          ref={tableRef}
          size="small"
          aria-label="todos"
          sx={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          {activeTodos.length === 0 && (
            <caption>Zo te zien heb je nog geen todos in deze lijst, maak er één bovenaan!</caption>
          )}
          <SortableContext items={activeTodos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <TableBody>
              {activeTodos.map((todo) => (
                <TodoRow key={todo.id} todo={todo} draggable />
              ))}
            </TableBody>
          </SortableContext>
        </Table>
      </TableContainer>
      <DragOverlay dropAnimation={null}>
        {activeId && activeTodo ? (
          <Paper elevation={3} style={{ width: tableWidth }}>
            <Table
              size="small"
              sx={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <TableBody>
                <TodoRow todo={activeTodo} draggable isOverlay />
              </TableBody>
            </Table>
          </Paper>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default RegularTodoTable;

