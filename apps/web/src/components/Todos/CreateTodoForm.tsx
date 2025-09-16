import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { type FC, type KeyboardEvent } from "react";
import { useStoreTodo } from "../../api/todo/storeTodo";
import { useUser } from "../../api/user/getUser";
import { useCurrentList } from "../../context/CurrentListState";
import { useZodForm } from "../../hooks/useZodForm";
import { storeSchema } from "../../schemas/todo";

const CreateTodoForm: FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  const startTime = new Date();
  startTime.setHours(0);
  startTime.setMinutes(0);

  const { data: user } = useUser();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useZodForm({ schema: storeSchema });

  const currentList = useCurrentList();
  const createTodoMutation = useStoreTodo();

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
      ...todo,
      done: false,
      listId: currentList.list?.id,
      startTime: new Date(),
    });
  });

  if (!user) return null;

  return (
    <form onSubmit={onSubmit}>
      <Grid sx={{ mb: 2 }} container justifyContent="center">
        <TextField
          inputProps={register("subject")}
          multiline={true}
          error={!!errors.subject}
          disabled={disabled}
          helperText={errors.subject?.message}
          variant="standard"
          label={`Wat moet er gebeuren, ${user.username}?`}
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{ maxWidth: "25rem" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" edge="start" color="default">
                  <AddCircleIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </form>
  );
};

export default CreateTodoForm;
