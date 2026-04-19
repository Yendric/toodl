import type { DragEndEvent, DragStartEvent, DropAnimation } from "@dnd-kit/core";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { useEffect, useRef, useState, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { triggerHaptic } from "../../helpers/haptic";
import TodoRow from "./TodoRow";

interface Props {
  activeTodos: TodoResponse[];
  onDragEnd: (event: DragEndEvent) => void;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

const RegularTodoTable: FC<Props> = ({ activeTodos: initialTodos, onDragEnd }) => {
  const [activeTodos, setActiveTodos] = useState(initialTodos);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [tableWidth, setTableWidth] = useState<number | undefined>(undefined);
  const tableRef = useRef<HTMLTableElement>(null);

  // Keep local state in sync with props
  useEffect(() => {
    setActiveTodos(initialTodos);
  }, [initialTodos]);

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
    triggerHaptic();
    setActiveId(event.active.id as number);
    if (tableRef.current) {
      setTableWidth(tableRef.current.clientWidth);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activeTodos.findIndex((t) => t.id === active.id);
      const newIndex = activeTodos.findIndex((t) => t.id === over.id);
      setActiveTodos((todos) => arrayMove(todos, oldIndex, newIndex));
    }

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
      <DragOverlay dropAnimation={dropAnimation}>
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

