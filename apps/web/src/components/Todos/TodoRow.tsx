import { type DraggableProvided } from "@hello-pangea/dnd";
import { useState, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import TodoEditRow from "./TodoRowEdit";
import TodoShowRow from "./TodoRowShow";

interface Props {
  todo: TodoResponse;
  provided?: DraggableProvided;
  isDragging?: boolean;
}

const TodoRow: FC<Props> = ({ todo, provided, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  return isEditing ? (
    <TodoEditRow todo={todo} toggleEditing={toggleEditing} provided={provided} isDragging={isDragging} />
  ) : (
    <TodoShowRow todo={todo} toggleEditing={toggleEditing} provided={provided} isDragging={isDragging} />
  );
};

export default TodoRow;
