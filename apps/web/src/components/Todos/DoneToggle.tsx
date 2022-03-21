import Checkbox from "@mui/material/Checkbox";
import ITodo from "../../types/ITodo";
import { FC } from "react";
import { useTodo } from "../../context/TodoState";

type Props = {
  todo: ITodo;
};

const DoneToggle: FC<Props> = ({ todo }) => {
  const { toggleDone } = useTodo();

  return (
    <Checkbox
      checked={todo.done}
      onChange={() => toggleDone(todo)}
      value="primary"
      inputProps={{ "aria-label": "primary checkbox" }}
    />
  );
};

export default DoneToggle;
