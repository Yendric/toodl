import { DatabaseLimitError } from "#/errors/DatabaseLimitError.js";
import prisma from "#/prisma.js";
import { ListService } from "#/services/ListService.js";
import { vi } from "vitest";

describe("ListService", () => {
  let listService: ListService;

  beforeEach(async () => {
    vi.clearAllMocks();
    listService = new ListService();
    await prisma.user.create({ data: { id: 1, email: "user@example.com", username: "User" } });
  });

  describe("listForUser", () => {
    it("should return lists for user ordered by name", async () => {
      await prisma.list.create({ data: { id: 1, name: "B List", userId: 1 } });
      await prisma.list.create({ data: { id: 2, name: "A List", userId: 1 } });

      const lists = await listService.listForUser(1);
      expect(lists).toHaveLength(2);
      expect(lists[0]?.name).toBe("A List");
      expect(lists[1]?.name).toBe("B List");
      expect(lists[0]?.permission).toBe("OWNER");
      expect(lists[0]?.isShared).toBe(false);
    });

    it("should include accepted shared lists with their permission", async () => {
      await prisma.user.create({ data: { id: 2, email: "owner@example.com", username: "Owner" } });
      await prisma.list.create({ data: { id: 1, name: "Mine", userId: 1 } });
      await prisma.list.create({ data: { id: 2, name: "Shared", userId: 2 } });
      await prisma.list.create({ data: { id: 3, name: "Pending", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 2, email: "user@example.com", userId: 1, permission: "WRITE", status: "ACCEPTED" },
      });
      await prisma.listShare.create({
        data: { listId: 3, email: "user@example.com", userId: 1, permission: "READ", status: "PENDING" },
      });

      const lists = await listService.listForUser(1);
      expect(lists.map((l) => l.name)).toEqual(["Mine", "Shared"]);

      const shared = lists.find((l) => l.name === "Shared");
      expect(shared?.permission).toBe("WRITE");
      expect(shared?.isShared).toBe(true);
      expect(shared?.ownerUsername).toBe("Owner");
    });
  });

  describe("create", () => {
    it("should create a list if under limit", async () => {
      for (let i = 1; i <= 5; i++) {
        await prisma.list.create({ data: { id: i, name: `List ${i}`, userId: 1 } });
      }

      const result = await listService.create(1, { name: "Test List", color: "#ffffff" });

      const dbList = await prisma.list.findUnique({ where: { id: result.id } });
      expect(dbList).not.toBeNull();
      expect(dbList?.name).toBe("Test List");
      expect(result.name).toBe("Test List");

      const count = await prisma.list.count({ where: { userId: 1 } });
      expect(count).toBe(6);
    });

    it("should throw error if at max limit", async () => {
      for (let i = 1; i <= 10; i++) {
        await prisma.list.create({ data: { id: i, name: `List ${i}`, userId: 1 } });
      }

      await expect(listService.create(1, { name: "Too many", color: "#000" })).rejects.toThrow(DatabaseLimitError);
    });
  });

  describe("update", () => {
    it("should update list", async () => {
      await prisma.list.create({ data: { id: 1, name: "Old Name", userId: 1 } });

      const result = await listService.update(1, 1, { name: "New Name", color: "#ff0000" });

      expect(result.name).toBe("New Name");
      expect(result.color).toBe("#ff0000");

      const dbList = await prisma.list.findUnique({ where: { id: 1 } });
      expect(dbList?.name).toBe("New Name");
      expect(dbList?.color).toBe("#ff0000");
    });
  });

  describe("delete", () => {
    it("should delete a list if more than one exists", async () => {
      await prisma.list.create({ data: { id: 1, name: "List 1", userId: 1 } });
      await prisma.list.create({ data: { id: 2, name: "List 2", userId: 1 } });

      await listService.delete(1, 1);

      const dbList = await prisma.list.findUnique({ where: { id: 1 } });
      expect(dbList).toBeNull();

      const count = await prisma.list.count({ where: { userId: 1 } });
      expect(count).toBe(1);
    });

    it("should throw error if only one list remains", async () => {
      await prisma.list.create({ data: { id: 1, name: "List 1", userId: 1 } });

      await expect(listService.delete(1, 1)).rejects.toThrow(DatabaseLimitError);
    });
  });
});
