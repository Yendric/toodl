import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

import { MoreVert } from "@mui/icons-material";
import { Checkbox, IconButton, TableCell, Typography } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { type CSSProperties, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { toDateTimeString } from "../../helpers/dateTime";
import { triggerHaptic } from "../../helpers/haptic";
import useContextMenu from "../../hooks/useContextMenu";
import { useTodoOptimisticMutations } from "../../hooks/useTodoOptimisticMutations";
import TodoContextMenu from "./TodoContextMenu/TodoContextMenu";

interface Props {
  todo: TodoResponse;
  toggleEditing: () => void;
  setNodeRef: (node: HTMLElement | null) => void;
  style: CSSProperties;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  isDragging?: boolean;
}

const TodoShowRow: FC<Props> = ({
  todo,
  toggleEditing,
  setNodeRef,
  style,
  attributes,
  listeners,
  isDragging,
}) => {
  const { updateTodo } = useTodoOptimisticMutations();

  const { handleContextMenu, contextMenu, handleClose } = useContextMenu();

  return (
    <>
      <TodoContextMenu todo={todo} contextMenu={contextMenu} handleClose={handleClose} />
      <TableRow
        ref={setNodeRef}
        style={{
          ...style,
          touchAction: "none",
          opacity: isDragging ? 0.4 : undefined,
        }}
        {...attributes}
        {...listeners}
        onContextMenu={handleContextMenu}
        sx={{ display: "table-row", cursor: "grab" }}
      >
        <TableCell
          padding="checkbox"
          sx={{ padding: "0 !important", paddingLeft: "8px !important", width: "48px" }}
        >
          <div>
            <Checkbox
              checked={todo.done}
              onChange={() => {
                triggerHaptic();
                updateTodo({
                  todoId: todo.id,
                  data: {
                    subject: todo.subject,
                    done: !todo.done,
                    position: todo.position,
                    startTime: todo.startTime || new Date().toISOString(),
                  },
                });
              }}
              value="primary"
            />
          </div>
        </TableCell>
        <TableCell sx={{ paddingLeft: "0 !important", paddingRight: "0 !important" }}>
          <div style={{ wordBreak: "break-word", width: "100%" }}>
            <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {todo.subject}
            </Typography>
            {todo.enableDeadline && todo.startTime && (
              <Typography
                onClick={toggleEditing}
                sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                style={{ textDecoration: todo.done ? "line-through" : "none" }}
              >
                {toDateTimeString(new Date(todo.startTime))}
              </Typography>
            )}
          </div>
        </TableCell>
        <TableCell align="right" sx={{ padding: "0 !important", width: "48px" }}>
          <div>
            <IconButton onClick={handleContextMenu} aria-label="edit" size="large">
              <MoreVert fontSize="small" />
            </IconButton>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TodoShowRow;
