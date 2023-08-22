import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Checkbox, IconButton, TableCell, TextField } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { FC, KeyboardEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useToggleTodo } from "../../api/todo/toggleTodo";
import { useUpdateTodo } from "../../api/todo/updateTodo";
import { useCurrentList } from "../../context/CurrentListState";
import ITodo from "../../types/ITodo";

interface Props {
  todo: ITodo;
  toggleEditing: () => void;
}

const schema = z.object({
  done: z.boolean().default(false),
  subject: z.string().min(1).max(255),
  description: z.string().max(255).nullable().default(""),
  isAllDay: z.boolean().nullable().default(false),
  location: z.string().max(255).nullable().default(""),
  recurrenceRule: z.string().max(255).nullable().default(""),
  recurrenceException: z.string().max(255).nullable().default(""),
  startTimezone: z.string().max(255).nullable().default(""),
  endTimezone: z.string().max(255).nullable().default(""),
  startTime: z.date().default(new Date()),
  endTime: z.date().nullable(),
  listId: z.number().nullable(),
});

const TodoEditRow: FC<Props> = ({ todo, toggleEditing }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ defaultValues: todo, resolver: zodResolver(schema) });
  const { list } = useCurrentList();
  const updateTodoMutation = useUpdateTodo();
  const toggleTodoMutation = useToggleTodo();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") handleSubmit(onSubmit)();
    if (event.key === "Escape") toggleEditing();
  }

  function onSubmit(data: z.infer<typeof schema>) {
    // Stel endTime in op startTime + 1 uur
    data.endTime = new Date(data.startTime.getTime() + 3600000);

    updateTodoMutation.mutate({ ...todo, ...data });
    toggleEditing();
  }

  if (list === undefined) {
    return;
  }

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
      {!list.withoutDates && (
        <TableCell width="20%" sx={{ padding: "0 !important" }}>
          <div>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, value } }) => (
                <MobileDateTimePicker
                  value={value}
                  onChange={onChange}
                  slotProps={{ textField: { variant: "standard" } }}
                  format="dd/MM/yy HH:mm"
                />
              )}
            />
          </div>
        </TableCell>
      )}
      <TableCell sx={{ padding: "0 !important" }}>
        <div>
          <TextField
            inputProps={register("subject")}
            error={!!errors.subject}
            helperText={errors.subject?.message}
            onKeyDown={(e) => handleKeyDown(e)}
            variant="standard"
            fullWidth
          />
        </div>
      </TableCell>
      <TableCell align="right" style={{ whiteSpace: "nowrap" }} sx={{ padding: "0 !important" }}>
        <div>
          <IconButton onClick={handleSubmit(onSubmit)} aria-label="edit" size="large">
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={toggleEditing} aria-label="edit" size="large">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TodoEditRow;
