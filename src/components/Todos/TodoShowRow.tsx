import { FC } from "react";
import TableRow from "@mui/material/TableRow";
import { useTodo } from "../../context/TodoState";
import ITodo from "../../types/ITodo";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, IconButton, TableCell, Typography } from "@mui/material";
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
    <TableRow>
      <TableCell padding="checkbox">
        <div>
          <Checkbox
            checked={todo.done}
            onChange={() => toggleDone(todo)}
            value="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </TableCell>
      {!currentList?.withoutDates && (
        <TableCell width="20%">
          <div>
            <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {toDateTimeString(todo.startTime)}
            </Typography>
          </div>
        </TableCell>
      )}
      <TableCell>
        <div>
          <Typography onClick={toggleEditing} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
            {todo.subject}
          </Typography>
        </div>
      </TableCell>
      <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
        <div>
          <IconButton onClick={() => destroy(todo)} aria-label="delete" size="large">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TodoShowRow;
