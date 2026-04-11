import { type DraggableProvided } from "@hello-pangea/dnd";
import { DragIndicator } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { Checkbox, IconButton, TableCell, TextField, Typography } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { type FC, type KeyboardEvent } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { useTodoUpdate } from "../../api/generated/toodl";
import { toDateTimeString } from "../../helpers/dateTime";
import { useZodForm } from "../../hooks/useZodForm";
import { updateSchema } from "../../schemas/todo";

interface Props {
  todo: TodoResponse;
  toggleEditing: () => void;
  provided?: DraggableProvided;
  isDragging?: boolean;
}

const TodoEditRow: FC<Props> = ({ todo, toggleEditing, provided, isDragging }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm({
    schema: updateSchema,
    defaultValues: {
      ...todo,
      startTime: todo.startTime ? new Date(todo.startTime) : new Date(),
      endTime: todo.endTime ? new Date(todo.endTime) : undefined,
    },
  });

  const updateTodoMutation = useTodoUpdate();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === "Escape") onSubmit();
  }

  const onSubmit = handleSubmit((data) => {
    updateTodoMutation.mutate({
      todoId: todo.id,
      data: {
        ...data,
        startTime: data.startTime?.toISOString() || new Date().toISOString(),
        endTime: data.endTime?.toISOString(),
      },
    });
    toggleEditing();
  });

  return (
    <TableRow
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      style={{ transition: "height 2s", ...provided?.draggableProps.style }}
      sx={{
        backgroundColor: isDragging ? "action.hover" : "inherit",
        display: provided ? "table-row" : "inherit",
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
              updateTodoMutation.mutate({
                todoId: todo.id,
                data: {
                  subject: todo.subject,
                  done: !todo.done,
                  startTime: todo.startTime || new Date().toISOString(),
                },
              })
            }
            value="primary"
          />
        </div>
      </TableCell>
      <TableCell sx={{ paddingLeft: "0 !important", paddingRight: "0 !important" }}>
        <div>
          <TextField
            multiline={true}
            {...register("subject")}
            error={!!errors.subject}
            helperText={errors.subject?.message}
            onKeyDown={(e) => handleKeyDown(e)}
            variant="standard"
            fullWidth
            autoFocus
            onBlur={onSubmit}
          />
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
