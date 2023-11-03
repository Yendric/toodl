import { MoreVert } from "@mui/icons-material";
import { Checkbox, IconButton, TableCell, Typography } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { FC } from "react";
import { useToggleTodo } from "../../api/todo/toggleTodo";
import { toDateTimeString } from "../../helpers/dateTime";
import useContextMenu from "../../hooks/useContextMenu";
import { LocalTodo } from "../../types/Todo";
import TodoContextMenu from "./TodoContextMenu/TodoContextMenu";

interface Props {
  todo: LocalTodo;
  toggleEditing: () => void;
}

const TodoShowRow: FC<Props> = ({ todo, toggleEditing }) => {
  const toggleTodoMutation = useToggleTodo();

  const { handleContextMenu, contextMenu, handleClose } = useContextMenu();

  return (
    <>
      <TodoContextMenu todo={todo} contextMenu={contextMenu} handleClose={handleClose} />
      <TableRow onContextMenu={handleContextMenu}>
        <TableCell padding="checkbox" sx={{ padding: "0 !important" }}>
          <div>
            <Checkbox
              checked={todo.done}
              onChange={() => toggleTodoMutation.mutate(todo)}
              value="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </div>
        </TableCell>
        <TableCell sx={{ paddingLeft: "0 !important", paddingRight: "0 !important" }}>
          <div>
            <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {todo.subject}
            </Typography>
            {todo.enableDeadline && (
              <Typography
                onClick={toggleEditing}
                sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                style={{ textDecoration: todo.done ? "line-through" : "none" }}
              >
                {toDateTimeString(todo.startTime)}
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
