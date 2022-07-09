import { FC, useState } from "react";
import ITodo from "../../types/ITodo";
import TodoEditRow from "./TodoEditRow";
import TodoShowRow from "./TodoShowRow";

interface Props {
  todo: ITodo;
}

const TodoRow: FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  return isEditing ? (
    <TodoEditRow todo={todo} toggleEditing={toggleEditing} />
  ) : (
    <TodoShowRow todo={todo} toggleEditing={toggleEditing} />
  );
};

export default TodoRow;
