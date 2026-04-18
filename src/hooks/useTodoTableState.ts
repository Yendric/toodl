import type { DropResult } from "@hello-pangea/dnd";
import { generateKeyBetween } from "fractional-indexing";
import { useMemo, useState } from "react";
import { useTodoDestroy, useTodoGetByListSuspense, useTodoUpdate } from "../api/generated/toodl";
import { useCurrentList } from "../context/CurrentListState";

export function useTodoTableState() {
  const { list, currentListId } = useCurrentList();
  const { data: listTodos = [] } = useTodoGetByListSuspense(currentListId);

  const updateTodoMutation = useTodoUpdate();
  const deleteTodoMutation = useTodoDestroy();

  const [destroyCompletedModalOpen, setDestroyCompletedModalOpen] = useState(false);

  const [selectedStoreId, setSelectedStoreIdState] = useState<number | "">(() => {
    const saved = localStorage.getItem("toodl_selected_store_id");
    return saved ? Number(saved) : "";
  });

  const setSelectedStoreId = (id: number | "") => {
    setSelectedStoreIdState(id);
    if (id === "") {
      localStorage.removeItem("toodl_selected_store_id");
    } else {
      localStorage.setItem("toodl_selected_store_id", id.toString());
    }
  };

  const activeTodos = useMemo(() => {
    return [...listTodos]
      .filter((todo) => !todo.done)
      .sort((a, b) => {
        const posA = a.position || "";
        const posB = b.position || "";
        if (posA !== posB) {
          if (posA === "") return 1;
          if (posB === "") return -1;
          return posA < posB ? -1 : 1;
        }
        return a.id - b.id;
      });
  }, [listTodos]);

  const completedTodos = useMemo(() => {
    return listTodos.filter((todo) => todo.done);
  }, [listTodos]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    const movedTodo = activeTodos[source.index]!;
    const tempActiveTodos = [...activeTodos];
    tempActiveTodos.splice(source.index, 1);

    const prevPos = tempActiveTodos[destination.index - 1]?.position || null;
    const nextPos = tempActiveTodos[destination.index]?.position || null;

    let newPosition: string;
    try {
      newPosition = generateKeyBetween(prevPos, nextPos);
    } catch {
      newPosition = new Date().getTime().toString();
    }

    updateTodoMutation.mutate({
      todoId: movedTodo.id,
      data: {
        subject: movedTodo.subject,
        done: movedTodo.done,
        position: newPosition,
        startTime: movedTodo.startTime || new Date().toISOString(),
        endTime: movedTodo.endTime,
        categoryId: movedTodo.categoryId,
        description: movedTodo.description,
        enableDeadline: movedTodo.enableDeadline,
        isAllDay: movedTodo.isAllDay,
        location: movedTodo.location,
        recurrenceRule: movedTodo.recurrenceRule,
        recurrenceException: movedTodo.recurrenceException,
        startTimezone: movedTodo.startTimezone,
        endTimezone: movedTodo.endTimezone,
        listId: movedTodo.listId,
      },
    });
  };

  const destroyCompleted = () => {
    // Note: No bulk delete endpoint available in the API yet.
    // Iterating individual mutations as a fallback.
    completedTodos.forEach((todo) => deleteTodoMutation.mutate({ todoId: todo.id }));
  };

  return {
    list,
    activeTodos,
    completedTodos,
    selectedStoreId,
    setSelectedStoreId,
    destroyCompletedModalOpen,
    setDestroyCompletedModalOpen,
    handleDragEnd,
    destroyCompleted,
  };
}
