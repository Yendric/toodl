import { FC } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { useTodo } from "../../context/TodoState";
import { useCurrentList } from "../../context/CurrentListState";
import Joi from "joi";
import joiMessages from "../../helpers/joiMessages";
import { joiResolver } from "@hookform/resolvers/joi";
import { Controller, useForm } from "react-hook-form";
import ITodo from "../../types/ITodo";

const schema = Joi.object({
  subject: Joi.string().max(255).required(),
  startTime: Joi.date().required(),
}).messages(joiMessages);

const CreateTodoForm: FC = () => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ITodo>({ defaultValues: { startTime: new Date(), subject: "" }, resolver: joiResolver(schema) });
  const todos = useTodo();
  const currentList = useCurrentList();

  function onSubmit(todo: ITodo) {
    todos.create({
      ...todo,
      done: false,
      listId: currentList.list?.id,
    });
    reset();
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
                onChange={onChange}
                renderInput={(props) => <TextField style={{ marginTop: "1rem" }} {...props} variant="standard" />}
                disablePast
                inputFormat="dd/MM/yyyy HH:mm"
              />
            )}
          />
        )}
        <TextField
          inputProps={register("subject")}
          error={!!errors.subject}
          helperText={errors.subject?.message}
          variant="standard"
          label="Todo onderwerp"
        />
        <Fab sx={{ marginLeft: 2, zIndex: 1 }} type="submit" color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Grid>
    </form>
  );
};

export default CreateTodoForm;
