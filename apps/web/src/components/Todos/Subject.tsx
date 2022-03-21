import ITodo from "../../types/ITodo";
import { FC, KeyboardEvent } from "react";
import { TextField, Typography } from "@mui/material";

type TodoProps = {
  todo: ITodo;
  isEditing: boolean;
  editingSubject: string;
  setEditingSubject: (subject: string) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  toggleEdit: () => void;
};

const Subject: FC<TodoProps> = ({ todo, isEditing, editingSubject, setEditingSubject, handleKeyDown, toggleEdit }) => {
  return (
    <>
      {isEditing ? (
        <TextField
          variant="standard"
          fullWidth={true}
          onChange={({ target }) => setEditingSubject(target.value)}
          value={editingSubject}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      ) : (
        <Typography onClick={toggleEdit} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
          {todo.subject}
        </Typography>
      )}
    </>
  );
};

export default Subject;
