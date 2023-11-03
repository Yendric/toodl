import { z } from "zod";
import { updateSchema } from "../schemas/todo";

export type Todo = z.infer<typeof updateSchema>;

export type UnstoredTodo = Omit<Todo, "id">;

export type LocalTodo = Todo & {
  localId: number;
};
