import { FC, KeyboardEvent } from "react";
import TableRow from "@mui/material/TableRow";
import { useTodo } from "../../context/TodoState";
import ITodo from "../../types/ITodo";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { Checkbox, IconButton, TableCell, TextField } from "@mui/material";
import { useCurrentList } from "../../context/CurrentListState";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import joiMessages from "../../helpers/joiMessages";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { Controller, useForm } from "react-hook-form";

interface Props {
  todo: ITodo;
  toggleEditing: () => void;
}

const schema = Joi.object({
  subject: Joi.string().max(255).required(),
  startTime: Joi.date().required(),
})
  .messages(joiMessages)
  .unknown(true);

const TodoEditRow: FC<Props> = ({ todo, toggleEditing }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ITodo>({ defaultValues: todo, resolver: joiResolver(schema) });
  const { list: currentList } = useCurrentList();
  const todos = useTodo();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") handleSubmit(onSubmit)();
    if (event.key === "Escape") toggleEditing();
  }

  function onSubmit(todo: ITodo) {
    // Stel endTime in op startTime + 1 uur
    todo.endTime = new Date(todo.startTime.getTime() + 3600000);

    todos.update(todo);
    toggleEditing();
  }

  return (
    <TableRow style={{ transition: "height 2s" }}>
      <TableCell padding="checkbox">
        <div>
          <Checkbox
            checked={todo.done}
            onChange={() => todos.toggleDone(todo)}
            value="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </TableCell>
      {!currentList?.withoutDates && (
        <TableCell width="20%">
          <div>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, value } }) => (
                <MobileDateTimePicker
                  value={value}
                  onChange={onChange}
                  renderInput={(props) => <TextField {...props} variant="standard" />}
                  format="dd/MM/yyyy HH:mm"
                />
              )}
            />
          </div>
        </TableCell>
      )}
      <TableCell>
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
      <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
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
