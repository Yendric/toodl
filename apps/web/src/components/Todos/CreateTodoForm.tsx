import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useStoreTodo } from "../../api/todo/storeTodo";
import { useCurrentList } from "../../context/CurrentListState";
import ITodo from "../../types/ITodo";

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
  endTime: z.date().optional(),
  listId: z.number().nullable().default(null),
});

const CreateTodoForm: FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ITodo>({ defaultValues: { startTime: new Date(), subject: "" }, resolver: zodResolver(schema) });

  const currentList = useCurrentList();
  const createTodoMutation = useStoreTodo();

  function onSubmit(todo: ITodo) {
    reset();
    setValue("startTime", new Date());
    createTodoMutation.mutate({
      ...todo,
      done: false,
      listId: currentList.list?.id,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid sx={{ mb: 2 }} container justifyContent="center">
        {!currentList.list?.withoutDates && (
          <Controller
            control={control}
            name="startTime"
            render={({ field: { onChange, value } }) => (
              <MobileDateTimePicker
                value={value}
                disabled={disabled}
                onChange={onChange}
                slotProps={{ textField: { style: { marginTop: "1rem" }, variant: "standard" } }}
                format="dd/MM/yyyy HH:mm"
              />
            )}
          />
        )}
        <TextField
          inputProps={register("subject")}
          error={!!errors.subject}
          disabled={disabled}
          helperText={errors.subject?.message}
          variant="standard"
          label="Todo onderwerp"
          sx={{ maxWidth: currentList.list?.withoutDates ? "22.5rem" : "10rem" }}
          fullWidth
        />
        <Fab sx={{ marginLeft: 2, zIndex: 1 }} type="submit" color="primary" aria-label="add" disabled={disabled}>
          <AddIcon />
        </Fab>
      </Grid>
    </form>
  );
};

export default CreateTodoForm;
