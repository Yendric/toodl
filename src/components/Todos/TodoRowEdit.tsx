import SaveIcon from "@mui/icons-material/Save";
import { Checkbox, IconButton, TableCell, TextField, Typography } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { type FC, type KeyboardEvent } from "react";
import { useToggleTodo } from "../../api/todo/toggleTodo";
import { useUpdateTodo } from "../../api/todo/updateTodo";
import { toDateTimeString } from "../../helpers/dateTime";
import { useZodForm } from "../../hooks/useZodForm";
import { updateSchema } from "../../schemas/todo";
import { type LocalTodo } from "../../types/Todo";

interface Props {
  todo: LocalTodo;
  toggleEditing: () => void;
}

const TodoEditRow: FC<Props> = ({ todo, toggleEditing }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm({ schema: updateSchema, defaultValues: todo });

  const updateTodoMutation = useUpdateTodo();
  const toggleTodoMutation = useToggleTodo();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === "Escape") onSubmit();
  }

  const onSubmit = handleSubmit((data) => {
    updateTodoMutation.mutate({ ...todo, ...data });
    toggleEditing();
  });

  return (
    <TableRow style={{ transition: "height 2s" }}>
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
          <TextField
            multiline={true}
            inputProps={register("subject")}
            error={!!errors.subject}
            helperText={errors.subject?.message}
            onKeyDown={(e) => handleKeyDown(e)}
            variant="standard"
            fullWidth
            autoFocus
            onBlur={onSubmit}
          />
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
      <TableCell align="right" style={{ width: 0, whiteSpace: "nowrap" }} sx={{ padding: "0 !important" }}>
        <div>
          <IconButton onClick={onSubmit} aria-label="edit" size="large">
            <SaveIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TodoEditRow;
