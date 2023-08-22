import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, IconButton, TableCell, Typography } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { FC } from "react";
import { useDeleteTodo } from "../../api/todo/destroyTodo";
import { useToggleTodo } from "../../api/todo/toggleTodo";
import { useCurrentList } from "../../context/CurrentListState";
import { toDateTimeString } from "../../helpers/dateTime";
import ITodo from "../../types/ITodo";

interface Props {
  todo: ITodo;
  toggleEditing: () => void;
}

const TodoShowRow: FC<Props> = ({ todo, toggleEditing }) => {
  const { list } = useCurrentList();
  const toggleTodoMutation = useToggleTodo();
  const deleteTodoMutation = useDeleteTodo();

  return (
    <TableRow>
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
      {!list?.withoutDates && (
        <TableCell width="20%" sx={{ padding: "0 !important" }}>
          <div>
            <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {toDateTimeString(todo.startTime)}
            </Typography>
          </div>
        </TableCell>
      )}
      <TableCell sx={{ padding: "0 !important" }}>
        <div>
          <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
            {todo.subject}
          </Typography>
        </div>
      </TableCell>
      <TableCell align="right" style={{ whiteSpace: "nowrap" }} sx={{ padding: "0 !important" }}>
        <div>
          <IconButton onClick={() => deleteTodoMutation.mutate(todo)} aria-label="delete" size="large">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TodoShowRow;
