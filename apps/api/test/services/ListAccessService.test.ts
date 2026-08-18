import { DataValidationError } from "#/errors/DataValidationError.js";
import prisma from "#/prisma.js";
import { ListAccessService } from "#/services/ListAccessService.js";
import { vi } from "vitest";

describe("ListAccessService", () => {
  let listAccessService: ListAccessService;

  beforeEach(() => {
    vi.clearAllMocks();
    listAccessService = new ListAccessService();
  });

  describe("getAccess", () => {
    it("should return OWNER for the list owner", async () => {
      await prisma.list.create({ data: { id: 1, name: "List", userId: 1 } });

      expect(await listAccessService.getAccess(1, 1)).toBe("OWNER");
    });

    it("should return null for a nonexistent list", async () => {
      expect(await listAccessService.getAccess(1, 999)).toBeNull();
    });

    it("should return null without an accepted share", async () => {
      await prisma.list.create({ data: { id: 1, name: "List", userId: 2 } });

      expect(await listAccessService.getAccess(1, 1)).toBeNull();
    });

    it("should return null for a pending share", async () => {
      await prisma.list.create({ data: { id: 1, name: "List", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 1, email: "user@example.com", userId: 1, permission: "WRITE", status: "PENDING" },
      });

      expect(await listAccessService.getAccess(1, 1)).toBeNull();
    });

    it("should return the share permission for an accepted share", async () => {
      await prisma.list.create({ data: { id: 1, name: "Read", userId: 2 } });
      await prisma.list.create({ data: { id: 2, name: "Write", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 1, email: "user@example.com", userId: 1, permission: "READ", status: "ACCEPTED" },
      });
      await prisma.listShare.create({
        data: { listId: 2, email: "user@example.com", userId: 1, permission: "WRITE", status: "ACCEPTED" },
      });

      expect(await listAccessService.getAccess(1, 1)).toBe("READ");
      expect(await listAccessService.getAccess(1, 2)).toBe("WRITE");
    });
  });

  describe("requireAccess", () => {
    it("should throw if access is below the minimum", async () => {
      await prisma.list.create({ data: { id: 1, name: "List", userId: 2 } });
      await prisma.listShare.create({
        data: { listId: 1, email: "user@example.com", userId: 1, permission: "READ", status: "ACCEPTED" },
      });

      await expect(listAccessService.requireAccess(1, 1, "WRITE")).rejects.toThrow(DataValidationError);
      await expect(listAccessService.requireAccess(1, 1, "OWNER")).rejects.toThrow(DataValidationError);
    });

    it("should return the access level when sufficient", async () => {
      await prisma.list.create({ data: { id: 1, name: "List", userId: 1 } });

      expect(await listAccessService.requireAccess(1, 1, "WRITE")).toBe("OWNER");
    });
  });
});
