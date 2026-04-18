import { type DraggableProvided } from "@hello-pangea/dnd";
import { DragIndicator, MoreVert } from "@mui/icons-material";
import { Checkbox, IconButton, TableCell, Typography } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { useTodoUpdate } from "../../api/generated/toodl";
import { toDateTimeString } from "../../helpers/dateTime";
import useContextMenu from "../../hooks/useContextMenu";
import TodoContextMenu from "./TodoContextMenu/TodoContextMenu";

interface Props {
  todo: TodoResponse;
  toggleEditing: () => void;
  provided?: DraggableProvided;
  isDragging?: boolean;
}

const TodoShowRow: FC<Props> = ({ todo, toggleEditing, provided, isDragging }) => {
  const toggleTodoMutation = useTodoUpdate();

  const { handleContextMenu, contextMenu, handleClose } = useContextMenu();

  return (
    <>
      <TodoContextMenu todo={todo} contextMenu={contextMenu} handleClose={handleClose} />
      <TableRow
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        onContextMenu={handleContextMenu}
        sx={{
          backgroundColor: isDragging ? "action.hover" : "inherit",
          display: "table-row",
        }}
      >
        <TableCell sx={{ padding: "0 !important", width: 0 }}>
          {provided && (
            <div {...provided.dragHandleProps} style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}>
              <DragIndicator fontSize="small" color="disabled" />
            </div>
          )}
        </TableCell>
        <TableCell padding="checkbox" sx={{ padding: "0 !important" }}>
          <div>
            <Checkbox
              checked={todo.done}
              onChange={() =>
                toggleTodoMutation.mutate({
                  todoId: todo.id,
                  data: {
                    subject: todo.subject,
                    done: !todo.done,
                    position: todo.position,
                    startTime: todo.startTime || new Date().toISOString(),
                  },
                })
              }
              value="primary"
            />
          </div>
        </TableCell>
        <TableCell sx={{ paddingLeft: "0 !important", paddingRight: "0 !important" }}>
          <div style={{ wordBreak: "break-word" }}>
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
        <TableCell align="right" style={{ whiteSpace: "nowrap" }} sx={{ padding: "0 !important" }}>
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
