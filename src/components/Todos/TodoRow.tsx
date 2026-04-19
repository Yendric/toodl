import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import TodoEditRow from "./TodoRowEdit";
import TodoShowRow from "./TodoRowShow";

interface Props {
  todo: TodoResponse;
  draggable?: boolean;
  isOverlay?: boolean;
}

const TodoRow: FC<Props> = ({ todo, draggable = false, isOverlay = false }) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    disabled: !draggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  return isEditing ? (
    <TodoEditRow
      todo={todo}
      toggleEditing={toggleEditing}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
      isOverlay={isOverlay}
    />
  ) : (
    <TodoShowRow
      todo={todo}
      toggleEditing={toggleEditing}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
      isOverlay={isOverlay}
    />
  );
};

export default TodoRow;
