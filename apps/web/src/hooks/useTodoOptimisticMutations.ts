import { useQueryClient } from "@tanstack/react-query";
import type { TodoResponse } from "../api/generated/model";
import { getTodoGetByListQueryKey, useTodoDestroy, useTodoStore, useTodoUpdate } from "../api/generated/toodl";
import { useCurrentList } from "../context/CurrentListState";

// TODO: cleanup this hot mess of spaghetti
export function useTodoOptimisticMutations() {
  const queryClient = useQueryClient();
  const { currentListId } = useCurrentList();
  const queryKey = getTodoGetByListQueryKey(currentListId);

  const createMutation = useTodoStore({
    mutation: {
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey });
        const previousTodos = queryClient.getQueryData<TodoResponse[]>(queryKey);

        if (previousTodos) {
          queryClient.setQueryData<TodoResponse[]>(queryKey, [
            {
              id: Math.random(), // Temporary ID
              subject: newTodo.data.subject,
              done: newTodo.data.done ?? false,
              position: newTodo.data.position ?? String(Date.now()),
              listId: currentListId,
              userId: 0,
              description: newTodo.data.description ?? null,
              enableDeadline: newTodo.data.enableDeadline ?? null,
              isAllDay: newTodo.data.isAllDay ?? null,
              location: newTodo.data.location ?? null,
              recurrenceRule: newTodo.data.recurrenceRule ?? null,
              startTimezone: newTodo.data.startTimezone ?? null,
              endTimezone: newTodo.data.endTimezone ?? null,
              startTime: newTodo.data.startTime ?? null,
              endTime: newTodo.data.endTime ?? null,
              recurrenceException: newTodo.data.recurrenceException ?? null,
              categoryId: newTodo.data.categoryId ?? null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as TodoResponse,
            ...previousTodos,
          ]);
        }

        return { previousTodos };
      },
      onError: (_err, _newTodo, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(queryKey, context.previousTodos);
        }
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey });
      },
    },
  });

  const updateMutation = useTodoUpdate({
    mutation: {
      onMutate: async ({ todoId, data }) => {
        await queryClient.cancelQueries({ queryKey });
        const previousTodos = queryClient.getQueryData<TodoResponse[]>(queryKey);

        if (previousTodos) {
          queryClient.setQueryData<TodoResponse[]>(
            queryKey,
            previousTodos.map((todo) => (todo.id === todoId ? ({ ...todo, ...data } as TodoResponse) : todo)),
          );
        }

        return { previousTodos };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(queryKey, context.previousTodos);
        }
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey });
      },
    },
  });

  const reorderMutation = useTodoUpdate({
    mutation: {
      onMutate: async ({ todoId, data }) => {
        await queryClient.cancelQueries({ queryKey });
        const previousTodos = queryClient.getQueryData<TodoResponse[]>(queryKey);

        if (previousTodos && data.position) {
          queryClient.setQueryData<TodoResponse[]>(
            queryKey,
            previousTodos.map((todo) =>
              todo.id === todoId ? ({ ...todo, position: data.position } as TodoResponse) : todo,
            ),
          );
        }

        return { previousTodos };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(queryKey, context.previousTodos);
        }
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey });
      },
    },
  });

  const deleteMutation = useTodoDestroy({
    mutation: {
      onMutate: async ({ todoId }) => {
        await queryClient.cancelQueries({ queryKey });
        const previousTodos = queryClient.getQueryData<TodoResponse[]>(queryKey);

        if (previousTodos) {
          queryClient.setQueryData<TodoResponse[]>(
            queryKey,
            previousTodos.filter((todo) => todo.id !== todoId),
          );
        }

        return { previousTodos };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(queryKey, context.previousTodos);
        }
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey });
      },
    },
  });

  return {
    createTodo: createMutation.mutate,
    updateTodo: updateMutation.mutate,
    reorderTodo: reorderMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    createTodoAsync: createMutation.mutateAsync,
    updateTodoAsync: updateMutation.mutateAsync,
    reorderTodoAsync: reorderMutation.mutateAsync,
    deleteTodoAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isReordering: reorderMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
