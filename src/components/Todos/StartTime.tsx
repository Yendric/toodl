import ITodo from "../../types/ITodo";
import { FC } from "react";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import { TextField, Typography } from "@mui/material";
import { toDateTimeString } from "../../helpers/DateTime";

type TodoProps = {
  todo: ITodo;
  isEditing: boolean;
  editingDate: Date;
  setEditingDate: (date: Date) => void;
  toggleEdit: () => void;
};

const StartTime: FC<TodoProps> = ({ todo, isEditing, editingDate, setEditingDate, toggleEdit }) => {
  return (
    <>
      {isEditing ? (
        <MobileDateTimePicker
          renderInput={(props) => <TextField {...props} variant="standard" />}
          value={editingDate}
          onChange={(date) => setEditingDate(date as Date)}
          inputFormat="dd/MM/yyyy HH:mm"
          cancelText="Annuleer"
          todayText="Vandaag"
        />
      ) : (
        <Typography onClick={toggleEdit} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
          {toDateTimeString(todo.startTime)}
        </Typography>
      )}
    </>
  );
};

export default StartTime;
