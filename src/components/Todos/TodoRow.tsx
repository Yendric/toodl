import { useState, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import TodoEditRow from "./TodoRowEdit";
import TodoShowRow from "./TodoRowShow";

interface Props {
  todo: TodoResponse;
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
