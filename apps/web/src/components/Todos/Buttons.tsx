import { FC } from "react";
import { IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ITodo from "../../types/ITodo";
import { useTodo } from "../../context/TodoState";

type TodoProps = {
  todo: ITodo;
  isEditing: boolean;
  updateTodo: () => void;
  toggleEdit: () => void;
};

const Buttons: FC<TodoProps> = ({ todo, isEditing, updateTodo, toggleEdit }) => {
  const { destroy } = useTodo();

  return (
    <>
      {isEditing ? (
        <>
          <IconButton
            onClick={() => {
              updateTodo();
              toggleEdit();
            }}
            aria-label="edit"
            size="large"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={toggleEdit} aria-label="edit" size="large">
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      ) : (
        <IconButton onClick={() => destroy(todo)} aria-label="delete" size="large">
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );
};

export default Buttons;
