import { FC } from "react";
import TableRow from "@mui/material/TableRow";
import { useTodo } from "../../context/TodoState";
import ITodo from "../../types/ITodo";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, Grow, IconButton, TableCell, Typography } from "@mui/material";
import { useCurrentList } from "../../context/CurrentListState";
import { toDateTimeString } from "../../helpers/DateTime";

interface Props {
  todo: ITodo;
  toggleEditing: () => void;
}

const TodoShowRow: FC<Props> = ({ todo, toggleEditing }) => {
  const { list: currentList } = useCurrentList();
  const { toggleDone, destroy } = useTodo();

  return (
    <Grow in={true} timeout={300}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={todo.done}
            onChange={() => toggleDone(todo)}
            value="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </TableCell>
        {!currentList?.withoutDates && (
          <TableCell width="20%">
            <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {toDateTimeString(todo.startTime)}
            </Typography>
          </TableCell>
        )}
        <TableCell>
          <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
            {todo.subject}
          </Typography>
        </TableCell>
        <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
          <IconButton onClick={() => destroy(todo)} aria-label="delete" size="large">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    </Grow>
  );
};

export default TodoShowRow;
