import { FC, KeyboardEvent, useState } from "react";
import TableRow from "@mui/material/TableRow";
import { useTodo } from "../../context/TodoState";
import ITodo from "../../types/ITodo";
import DoneToggle from "./DoneToggle";
import StartTime from "./StartTime";
import Buttons from "./Buttons";
import Subject from "./Subject";
import { TableCell } from "@mui/material";

type TodoProps = {
  todo: ITodo;
};

const Todo: FC<TodoProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDate, setEditingDate] = useState(todo.startTime);
  const [editingSubject, setEditingSubject] = useState(todo.subject);
  const { update } = useTodo();

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      toggleEdit();
      updateTodo();
    } else if (event.key === "Escape") {
      toggleEdit();
    }
  }

  function updateTodo() {
    update({ ...todo, startTime: editingDate, subject: editingSubject });
  }

  return (
    <TableRow>
      <TableCell padding="checkbox">
        <DoneToggle todo={todo} />
      </TableCell>
      <TableCell width="20%">
        <StartTime
          todo={todo}
          isEditing={isEditing}
          editingDate={editingDate}
          setEditingDate={setEditingDate}
          toggleEdit={toggleEdit}
        />
      </TableCell>
      <TableCell>
        <Subject
          todo={todo}
          isEditing={isEditing}
          editingSubject={editingSubject}
          setEditingSubject={setEditingSubject}
          handleKeyDown={handleKeyDown}
          toggleEdit={toggleEdit}
        />
      </TableCell>
      <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
        <Buttons todo={todo} isEditing={isEditing} updateTodo={updateTodo} toggleEdit={toggleEdit} />
      </TableCell>
    </TableRow>
  );
};

export default Todo;
