import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { type FC, type KeyboardEvent } from "react";
import { useTodoStore, useUserInfoSuspense } from "../../api/generated/toodl";
import { useCurrentList } from "../../context/CurrentListState";
import { useZodForm } from "../../hooks/useZodForm";
import { storeSchema } from "../../schemas/todo";

const CreateTodoForm: FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  const { data: user } = useUserInfoSuspense();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: storeSchema,
    defaultValues: {
      done: false,
      subject: "",
      startTime: new Date(),
    },
  });

  const currentList = useCurrentList();
  const createTodoMutation = useTodoStore();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  }

  const onSubmit = handleSubmit((todo) => {
    reset();
    setValue("startTime", new Date());

    createTodoMutation.mutate({
      data: {
        ...todo,
        done: false,
        listId: currentList.list?.id,
        startTime: new Date().toISOString(),
        endTime: todo.endTime?.toISOString(),
      },
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Grid container sx={{ mb: 2, justifyContent: "center" }}>
        <TextField
          {...register("subject")}
          multiline={true}
          error={!!errors.subject}
          disabled={disabled}
          helperText={errors.subject?.message}
          variant="standard"
          label={`Wat moet er gebeuren, ${user.username}?`}
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{ maxWidth: "25rem" }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="start" color="default">
                    <AddCircleIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}

        />
      </Grid>
    </form>
  );
};

export default CreateTodoForm;
