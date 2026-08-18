import { DataValidationError } from "#/errors/DataValidationError.js";
import { DatabaseLimitError } from "#/errors/DatabaseLimitError.js";
import prisma from "#/prisma.js";
import { ListAccessService } from "#/services/ListAccessService.js";
import { TodoService } from "#/services/TodoService.js";
import { vi } from "vitest";

describe("TodoService", () => {
  let todoService: TodoService;

  beforeEach(async () => {
    vi.clearAllMocks();
    todoService = new TodoService(new ListAccessService());
    await prisma.user.create({ data: { id: 1, email: "user@example.com", username: "User" } });
  });

  describe("listForUser", () => {
    const userId = 1;
    it("should return sorted todos without storeId", async () => {
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a0", userId, categoryId: null },
      });

      const result = await todoService.listForUser(userId);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(1);
      expect(result[0]?.createdBy).toBe("User");
    });

    it("should return sorted todos with storeId", async () => {
      await prisma.category.create({ data: { id: 1, name: "Cat 1", userId } });
      await prisma.category.create({ data: { id: 2, name: "Cat 2", userId } });
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a0", userId, categoryId: 1 },
      });
      await prisma.todo.create({
        data: { id: 2, subject: "Todo 2", done: false, position: "a1", userId, categoryId: 2 },
      });

      await prisma.store.create({ data: { id: 100, userId, name: "Store 1" } });
      await prisma.storeCategoryOrder.create({ data: { storeId: 100, categoryId: 2, position: 0 } });
      await prisma.storeCategoryOrder.create({ data: { storeId: 100, categoryId: 1, position: 1 } });

      const result = await todoService.listForUser(userId, 100);

      expect(result?.[0]?.id).toBe(2);
      expect(result?.[1]?.id).toBe(1);
    });

    it("should throw error if store not found", async () => {
      await expect(todoService.listForUser(userId, 100)).rejects.toThrow(DataValidationError);
    });

    it("should fallback to position if store orders are equal", async () => {
      await prisma.category.create({ data: { id: 1, name: "Cat 1", userId } });
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a1", userId, categoryId: 1 },
      });
      await prisma.todo.create({
        data: { id: 2, subject: "Todo 2", done: false, position: "a0", userId, categoryId: 1 },
      });

      await prisma.store.create({ data: { id: 100, userId, name: "Store 1" } });
      await prisma.storeCategoryOrder.create({ data: { storeId: 100, categoryId: 1, position: 0 } });

      const result = await todoService.listForUser(userId, 100);

      expect(result?.[0]?.id).toBe(2);
      expect(result?.[1]?.id).toBe(1);
    });
  });

  describe("listByList", () => {
    const userId = 1;
    const listId = 10;

    it("should return sorted todos for a specific list without storeId", async () => {
      await prisma.list.create({ data: { id: listId, name: "List 1", userId } });
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a0", userId, listId, categoryId: null },
      });

      const result = await todoService.listByList(1, listId);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(1);
    });

    it("should return sorted todos for a specific list with storeId", async () => {
      await prisma.category.create({ data: { id: 1, name: "Cat 1", userId } });
      await prisma.list.create({ data: { id: listId, name: "List 1", userId } });
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a0", userId, listId, categoryId: 1 },
      });
      await prisma.store.create({ data: { id: 100, userId, name: "Store 1" } });
      await prisma.storeCategoryOrder.create({ data: { storeId: 100, categoryId: 1, position: 0 } });

      const result = await todoService.listByList(1, listId, 100);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(1);
      expect(result[0]?.categoryName).toBe("Cat 1");
    });

    it("should throw error if store not found", async () => {
      await prisma.list.create({ data: { id: listId, name: "List 1", userId } });

      await expect(todoService.listByList(1, listId, 100)).rejects.toThrow(DataValidationError);
    });

    it("should return an empty list if user has no access to the list", async () => {
      await prisma.list.create({ data: { id: listId, name: "List 1", userId: 2 } });
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a0", userId: 2, listId },
      });

      expect(await todoService.listByList(1, listId)).toEqual([]);
    });

    it("should return todos of a shared list for an accepted sharee", async () => {
      await prisma.user.create({ data: { id: 2, email: "owner@example.com", username: "Owner" } });
      await prisma.list.create({ data: { id: listId, name: "List 1", userId: 2 } });
      await prisma.listShare.create({
        data: { listId, email: "user@example.com", userId: 1, permission: "READ", status: "ACCEPTED" },
      });
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a0", userId: 2, listId },
      });

      const result = await todoService.listByList(1, listId);
      expect(result).toHaveLength(1);
      expect(result[0]?.createdBy).toBe("Owner");
    });
  });

  describe("create", () => {
    const userId = 1;
    const todoData = { subject: "Test Todo", listId: 10, categoryId: 5 };

    it("should create a todo if list and category exist", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId } });
      await prisma.category.create({ data: { id: 5, name: "Cat 1", userId } });

      const result = await todoService.create(1, todoData);

      expect(result.subject).toBe("Test Todo");
      expect(result.listId).toBe(10);
      expect(result.categoryId).toBe(5);
      expect(result.position).toBeDefined();

      const dbTodo = await prisma.todo.findUnique({ where: { id: result.id } });
      expect(dbTodo).not.toBeNull();
    });

    it("should throw error if category not found for user", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId } });

      await expect(todoService.create(1, todoData)).rejects.toThrow(DataValidationError);
    });

    it("should throw error if list not found", async () => {
      await expect(todoService.create(1, { subject: "Test", listId: 999 })).rejects.toThrow(DataValidationError);
    });

    it("should throw error if list has 100 or more todos", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId } });

      for (let i = 1; i <= 100; i++) {
        await prisma.todo.create({
          data: { id: i, subject: `Todo ${i}`, done: false, position: `a${i}`, userId, listId: 10 },
        });
      }

      await expect(todoService.create(1, { subject: "Max", listId: 10 })).rejects.toThrow(DatabaseLimitError);
    });

    it("should generate a position if none is provided based on last todo", async () => {
      await prisma.todo.create({
        data: { id: 1, subject: "Todo 1", done: false, position: "a0", userId, listId: null },
      });

      const result = await todoService.create(1, { subject: "Test Todo 2" });

      expect(result.position).toBeDefined();
      expect(result.position > "a0").toBe(true);
    });

    it("should allow creating a todo in a shared list with write permission", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 10, email: "user@example.com", userId: 1, permission: "WRITE", status: "ACCEPTED" },
      });

      const result = await todoService.create(1, { subject: "Shared todo", listId: 10 });
      expect(result.userId).toBe(1);
    });

    it("should reject creating a todo in a shared list with read permission", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 10, email: "user@example.com", userId: 1, permission: "READ", status: "ACCEPTED" },
      });

      await expect(todoService.create(1, { subject: "Shared todo", listId: 10 })).rejects.toThrow(DataValidationError);
    });
  });

  describe("update", () => {
    const userId = 1;
    const todoId = 100;

    it("should allow setting listId to null", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId } });
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0", listId: 10 } });

      await todoService.update(1, todoId, { listId: null });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.listId).toBeNull();
    });

    it("should verify list access when updating listId", async () => {
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0", listId: null } });

      await expect(todoService.update(1, todoId, { listId: 20 })).rejects.toThrow(DataValidationError);
    });

    it("should connect new list when listId is valid", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId } });
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0", listId: null } });

      await todoService.update(1, todoId, { listId: 10 });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.listId).toBe(10);
    });

    it("should allow setting categoryId to null", async () => {
      await prisma.category.create({ data: { id: 5, name: "Cat 1", userId } });
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0", categoryId: 5 } });

      await todoService.update(1, todoId, { categoryId: null });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.categoryId).toBeNull();
    });

    it("should verify category ownership when updating categoryId", async () => {
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0", categoryId: null } });

      await expect(todoService.update(1, todoId, { categoryId: 20 })).rejects.toThrow(DataValidationError);
    });

    it("should connect new category when categoryId is valid", async () => {
      await prisma.category.create({ data: { id: 5, name: "Cat 1", userId } });
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0", categoryId: null } });

      await todoService.update(1, todoId, { categoryId: 5 });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.categoryId).toBe(5);
    });

    it("should update startTime and endTime", async () => {
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0" } });
      const newStart = new Date("2025-01-01T10:00:00Z");
      const newEnd = new Date("2025-01-01T11:00:00Z");

      await todoService.update(1, todoId, { startTime: newStart, endTime: newEnd });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.startTime).toEqual(newStart);
      expect(dbTodo?.endTime).toEqual(newEnd);
    });

    it("should allow a write sharee to update another user's todo in the shared list", async () => {
      await prisma.user.create({ data: { id: 2, email: "owner@example.com", username: "Owner" } });
      await prisma.list.create({ data: { id: 10, name: "List 1", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 10, email: "user@example.com", userId: 1, permission: "WRITE", status: "ACCEPTED" },
      });
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId: 2, position: "a0", listId: 10 } });

      await todoService.update(1, todoId, { subject: "Updated" });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.subject).toBe("Updated");
    });

    it("should let a write sharee resend the todo's existing foreign categoryId", async () => {
      await prisma.user.create({ data: { id: 2, email: "owner@example.com", username: "Owner" } });
      await prisma.list.create({ data: { id: 10, name: "List 1", userId: 2 } });
      await prisma.category.create({ data: { id: 5, name: "Cat 1", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 10, email: "user@example.com", userId: 1, permission: "WRITE", status: "ACCEPTED" },
      });
      await prisma.todo.create({
        data: { id: todoId, subject: "Test", userId: 2, position: "a0", listId: 10, categoryId: 5 },
      });

      await todoService.update(1, todoId, { subject: "Updated", categoryId: 5 });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.subject).toBe("Updated");
      expect(dbTodo?.categoryId).toBe(5);
    });

    it("should let a write sharee move a todo to a list they can write to", async () => {
      await prisma.user.create({ data: { id: 2, email: "owner@example.com", username: "Owner" } });
      await prisma.list.create({ data: { id: 10, name: "Shared", userId: 2 } });
      await prisma.list.create({ data: { id: 11, name: "Mine", userId: 1 } });
      await prisma.listShare.create({
        data: { listId: 10, email: "user@example.com", userId: 1, permission: "WRITE", status: "ACCEPTED" },
      });
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId: 2, position: "a0", listId: 10 } });

      await todoService.update(1, todoId, { listId: 11 });

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo?.listId).toBe(11);
    });

    it("should reject a read sharee updating a todo in the shared list", async () => {
      await prisma.list.create({ data: { id: 10, name: "List 1", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 10, email: "user@example.com", userId: 1, permission: "READ", status: "ACCEPTED" },
      });
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId: 2, position: "a0", listId: 10 } });

      await expect(todoService.update(1, todoId, { subject: "Updated" })).rejects.toThrow(DataValidationError);
    });
  });

  describe("delete", () => {
    const userId = 1;
    const todoId = 100;

    it("should delete a todo", async () => {
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId, position: "a0" } });

      await todoService.delete(1, todoId);

      const dbTodo = await prisma.todo.findUnique({ where: { id: todoId } });
      expect(dbTodo).toBeNull();
    });

    it("should reject deleting another user's todo outside shared lists", async () => {
      await prisma.todo.create({ data: { id: todoId, subject: "Test", userId: 2, position: "a0" } });

      await expect(todoService.delete(1, todoId)).rejects.toThrow(DataValidationError);
    });
  });
});
