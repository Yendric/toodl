import { DataValidationError } from "#/errors/DataValidationError.js";
import { DatabaseLimitError } from "#/errors/DatabaseLimitError.js";
import { Prisma, type Todo } from "#/generated/prisma/client.js";
import prisma from "#/prisma.js";
import { ListAccessService } from "#/services/ListAccessService.js";
import dayjs from "dayjs";
import { generateKeyBetween } from "fractional-indexing";

export type TodoCreateData = Partial<
  Omit<Todo, "id" | "userId" | "createdAt" | "updatedAt" | "startTime" | "endTime">
> & {
  subject: string;
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  categoryId?: number | null;
};

export type TodoWithMeta = Todo & { createdBy: string; categoryName: string | null };

const todoInclude = { user: { select: { username: true } }, category: { select: { name: true } } };

type TodoWithRelations = Todo & { user: { username: string }; category: { name: string } | null };

function withMeta({ user, category, ...todo }: TodoWithRelations): TodoWithMeta {
  return { ...todo, createdBy: user.username, categoryName: category?.name ?? null };
}

export interface ITodoService {
  listForUser(userId: number, storeId?: number): Promise<TodoWithMeta[]>;
  listByList(userId: number, listId: number, storeId?: number): Promise<TodoWithMeta[]>;
  create(userId: number, data: TodoCreateData): Promise<TodoWithMeta>;
  update(userId: number, todoId: number, data: Partial<TodoCreateData>): Promise<TodoWithMeta>;
  delete(userId: number, todoId: number): Promise<Todo>;
}

import { inject, injectable } from "inversify";

@injectable()
export class TodoService implements ITodoService {
  constructor(@inject(ListAccessService) private listAccessService: ListAccessService) {}

  public async listForUser(userId: number, storeId?: number): Promise<TodoWithMeta[]> {
    const storeOrderMap = await this.getStoreOrderMap(userId, storeId);

    const todos = await prisma.todo.findMany({
      where: { userId },
      include: todoInclude,
      orderBy: [{ done: "asc" }, { position: "asc" }, { startTime: "asc" }],
    });

    return this.sortTodosByStoreMap(todos.map(withMeta), storeOrderMap);
  }

  public async listByList(userId: number, listId: number, storeId?: number): Promise<TodoWithMeta[]> {
    const access = await this.listAccessService.getAccess(userId, listId);
    if (!access) return [];
    const storeOrderMap = await this.getStoreOrderMap(userId, storeId);

    const todos = await prisma.todo.findMany({
      where: { listId },
      include: todoInclude,
      orderBy: [{ done: "asc" }, { position: "asc" }, { startTime: "asc" }],
    });

    return this.sortTodosByStoreMap(todos.map(withMeta), storeOrderMap);
  }

  private async getStoreOrderMap(userId: number, storeId?: number): Promise<Map<number, number> | undefined> {
    if (!storeId) return undefined;

    const store = await prisma.store.findFirst({
      where: { id: storeId, userId },
      include: { categoryOrders: true },
    });
    if (!store) throw new DataValidationError("Winkel niet gevonden.");
    return new Map(store.categoryOrders.map((o) => [o.categoryId, o.position]));
  }

  private sortTodosByStoreMap<T extends Todo>(todos: T[], orderMap?: Map<number, number>): T[] {
    if (!orderMap) return todos;

    return todos.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;

      const orderA = a.categoryId !== null ? (orderMap.get(a.categoryId) ?? Infinity) : Infinity;
      const orderB = b.categoryId !== null ? (orderMap.get(b.categoryId) ?? Infinity) : Infinity;

      if (orderA !== orderB) return orderA - orderB;

      return a.position.localeCompare(b.position);
    });
  }

  public async create(userId: number, data: TodoCreateData): Promise<TodoWithMeta> {
    const { startTime, endTime, listId, categoryId, ...rest } = data;
    const finalStartTime = startTime ? new Date(startTime) : new Date();
    const finalEndTime = endTime ? new Date(endTime) : dayjs(finalStartTime).add(1, "hour").toDate();

    if (listId) {
      await this.listAccessService.requireAccess(userId, listId, "WRITE");

      const amount = await prisma.todo.count({ where: { listId } });
      if (amount >= 100) {
        throw new DatabaseLimitError("Je kan maximaal 100 todos per lijst hebben.");
      }
    }

    if (categoryId) {
      const categoryCount = await prisma.category.count({
        where: { id: categoryId, userId },
      });
      if (categoryCount === 0) throw new DataValidationError("Categorie niet gevonden.");
    }

    let finalPosition = rest.position;
    if (!finalPosition) {
      const lastTodo = await prisma.todo.findFirst({
        where: listId ? { listId } : { userId, listId: null },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      finalPosition = generateKeyBetween(lastTodo?.position || null, null);
    }

    const todo = await prisma.todo.create({
      data: {
        ...rest,
        position: finalPosition,
        startTime: finalStartTime,
        endTime: finalEndTime,
        listId,
        categoryId,
        userId,
      },
      include: todoInclude,
    });
    return withMeta(todo);
  }

  public async update(userId: number, todoId: number, data: Partial<TodoCreateData>): Promise<TodoWithMeta> {
    const todo = await this.requireTodoAccess(userId, todoId);
    const { startTime, endTime, listId, categoryId, ...rest } = data;
    const updateData: Prisma.TodoUpdateInput = { ...rest };

    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);

    if (listId !== undefined) {
      if (listId === null) {
        updateData.list = { disconnect: true };
      } else {
        if (listId !== todo.listId) {
          await this.listAccessService.requireAccess(userId, listId, "WRITE");
        }
        updateData.list = { connect: { id: listId } };
      }
    }

    if (categoryId !== undefined) {
      if (categoryId === null) {
        updateData.category = { disconnect: true };
      } else {
        if (categoryId !== todo.categoryId) {
          const categoryCount = await prisma.category.count({
            where: { id: categoryId, userId },
          });
          if (categoryCount === 0) throw new DataValidationError("Categorie niet gevonden.");
        }
        updateData.category = { connect: { id: categoryId } };
      }
    }

    const updated = await prisma.todo.update({
      data: updateData,
      where: { id: todoId },
      include: todoInclude,
    });
    return withMeta(updated);
  }

  public async delete(userId: number, todoId: number): Promise<Todo> {
    await this.requireTodoAccess(userId, todoId);
    return await prisma.todo.delete({ where: { id: todoId } });
  }

  private async requireTodoAccess(userId: number, todoId: number): Promise<Todo> {
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo) throw new DataValidationError("Todo niet gevonden.");

    if (todo.listId) {
      await this.listAccessService.requireAccess(userId, todo.listId, "WRITE");
    } else if (todo.userId !== userId) {
      throw new DataValidationError("Todo niet gevonden.");
    }

    return todo;
  }
}
