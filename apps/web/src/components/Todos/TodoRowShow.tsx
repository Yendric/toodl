import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

import { MoreVert } from "@mui/icons-material";
import { Checkbox, IconButton, TableCell, Typography } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { CSSProperties, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { useTodoUpdate } from "../../api/generated/toodl";
import { toDateTimeString } from "../../helpers/dateTime";
import useContextMenu from "../../hooks/useContextMenu";
import TodoContextMenu from "./TodoContextMenu/TodoContextMenu";

import { triggerHaptic } from "../../helpers/haptic";

interface Props {
  todo: TodoResponse;
  toggleEditing: () => void;
  setNodeRef: (node: HTMLElement | null) => void;
  style: CSSProperties;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  isDragging?: boolean;
  isOverlay?: boolean;
}

const TodoShowRow: FC<Props> = ({
  todo,
  toggleEditing,
  setNodeRef,
  style,
  attributes,
  listeners,
  isDragging,
  isOverlay,
}) => {
  const toggleTodoMutation = useTodoUpdate();

  const { handleContextMenu, contextMenu, handleClose } = useContextMenu();

  const draggingStyles: CSSProperties = isOverlay
    ? {
        transform: "scale(1.03)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        opacity: 1,
        zIndex: 99,
        position: "relative",
        backgroundColor: "var(--mui-palette-background-paper)",
      }
    : isDragging
      ? {
          transform: style.transform,
          opacity: 0.4,
          backgroundColor: "var(--mui-palette-background-paper)",
        }
      : {
          transform: style.transform,
        };

  return (
    <>
      <TodoContextMenu todo={todo} contextMenu={contextMenu} handleClose={handleClose} />
      <TableRow
        ref={setNodeRef}
        style={{
          ...style,
          ...draggingStyles,
          transition: isOverlay
            ? "transform 250ms ease, box-shadow 250ms ease"
            : style.transition,
          touchAction: "none",
        }}
        {...attributes}
        {...listeners}
        onContextMenu={handleContextMenu}
        sx={{
          backgroundColor: isOverlay ? "background.paper" : isDragging ? "action.hover" : "inherit",
          display: "table-row",
          cursor: isOverlay ? "grabbing" : isDragging ? "grabbing" : "grab",
          "&.Mui-selected": {
            backgroundColor: isOverlay ? "background.paper" : undefined,
          },
          // Fix for table borders during drag
          "& td": {
            borderBottom: (isDragging || isOverlay) ? "none !important" : undefined,
          }
        }}
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
                toggleTodoMutation.mutate({
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
