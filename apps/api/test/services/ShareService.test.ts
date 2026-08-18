import { DataValidationError } from "#/errors/DataValidationError.js";
import { DatabaseLimitError } from "#/errors/DatabaseLimitError.js";
import prisma from "#/prisma.js";
import { ListAccessService } from "#/services/ListAccessService.js";
import { type MailService } from "#/services/MailService.js";
import { ShareService } from "#/services/ShareService.js";
import { vi } from "vitest";

const owner = { id: 1, email: "owner@example.com", username: "Owner" };
const shareeEmail = "sharee@example.com";

describe("ShareService", () => {
  let shareService: ShareService;
  let sendShareInvitationMail: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    sendShareInvitationMail = vi.fn();
    shareService = new ShareService({ sendShareInvitationMail } as unknown as MailService, new ListAccessService());
    await prisma.user.create({ data: { id: 1, email: owner.email, username: "Owner" } });
    await prisma.list.create({ data: { id: 1, name: "List", userId: 1 } });
  });

  describe("create", () => {
    it("should create a pending share linked to an existing user and mail them", async () => {
      await prisma.user.create({ data: { id: 2, email: shareeEmail, username: "Sharee" } });

      const share = await shareService.create(owner, 1, { email: "Sharee@Example.com", permission: "WRITE" });

      expect(share.email).toBe(shareeEmail);
      expect(share.userId).toBe(2);
      expect(share.status).toBe("PENDING");
      expect(share.permission).toBe("WRITE");
      expect(sendShareInvitationMail).toHaveBeenCalledOnce();
    });

    it("should create an unlinked share without mail when no account exists", async () => {
      const share = await shareService.create(owner, 1, { email: "nobody@example.com", permission: "READ" });

      expect(share.status).toBe("PENDING");
      expect(share.userId).toBeNull();
      expect(sendShareInvitationMail).not.toHaveBeenCalled();
    });

    it("should reject sharing with yourself", async () => {
      await expect(shareService.create(owner, 1, { email: owner.email, permission: "READ" })).rejects.toThrow(
        DataValidationError,
      );
    });

    it("should reject sharing the same list with the same email twice", async () => {
      await shareService.create(owner, 1, { email: shareeEmail, permission: "READ" });

      await expect(shareService.create(owner, 1, { email: shareeEmail, permission: "READ" })).rejects.toThrow(
        DataValidationError,
      );
    });

    it("should reject sharing when not the owner", async () => {
      await expect(
        shareService.create({ id: 2, email: shareeEmail, username: "Sharee" }, 1, {
          email: "x@example.com",
          permission: "READ",
        }),
      ).rejects.toThrow(DataValidationError);
    });

    it("should reject more than 10 shares per list", async () => {
      for (let i = 0; i < 10; i++) {
        await prisma.listShare.create({ data: { listId: 1, email: `person${i}@example.com` } });
      }

      await expect(shareService.create(owner, 1, { email: shareeEmail, permission: "READ" })).rejects.toThrow(
        DatabaseLimitError,
      );
    });
  });

  describe("updatePermission", () => {
    it("should update the permission as owner", async () => {
      const share = await prisma.listShare.create({ data: { listId: 1, email: shareeEmail, permission: "READ" } });

      const updated = await shareService.updatePermission(owner.id, share.id, "WRITE");
      expect(updated.permission).toBe("WRITE");
    });

    it("should reject when not the owner", async () => {
      const share = await prisma.listShare.create({ data: { listId: 1, email: shareeEmail, userId: 2 } });

      await expect(shareService.updatePermission(2, share.id, "WRITE")).rejects.toThrow(DataValidationError);
    });
  });

  describe("revoke", () => {
    it("should delete the share as owner", async () => {
      const share = await prisma.listShare.create({ data: { listId: 1, email: shareeEmail } });

      await shareService.revoke(owner.id, share.id);
      expect(await prisma.listShare.findUnique({ where: { id: share.id } })).toBeNull();
    });

    it("should reject when not the owner", async () => {
      const share = await prisma.listShare.create({ data: { listId: 1, email: shareeEmail, userId: 2 } });

      await expect(shareService.revoke(2, share.id)).rejects.toThrow(DataValidationError);
    });
  });

  describe("invitationsForUser", () => {
    it("should return pending shares with list info", async () => {
      await prisma.listShare.create({ data: { listId: 1, email: shareeEmail, userId: 2, status: "PENDING" } });

      const invitations = await shareService.invitationsForUser(2);
      expect(invitations).toHaveLength(1);
      expect(invitations[0]?.listName).toBe("List");
      expect(invitations[0]?.ownerUsername).toBe("Owner");
    });

    it("should not return accepted shares", async () => {
      await prisma.listShare.create({ data: { listId: 1, email: shareeEmail, userId: 2, status: "ACCEPTED" } });

      expect(await shareService.invitationsForUser(2)).toHaveLength(0);
    });
  });

  describe("accept", () => {
    it("should accept a pending share", async () => {
      const share = await prisma.listShare.create({
        data: { listId: 1, email: shareeEmail, userId: 2, status: "PENDING" },
      });

      await shareService.accept(2, 1);

      const dbShare = await prisma.listShare.findUnique({ where: { id: share.id } });
      expect(dbShare?.status).toBe("ACCEPTED");
    });

    it("should throw when there is no pending share", async () => {
      await expect(shareService.accept(2, 1)).rejects.toThrow(DataValidationError);
    });
  });

  describe("leave", () => {
    it("should delete the user's own share", async () => {
      const share = await prisma.listShare.create({
        data: { listId: 1, email: shareeEmail, userId: 2, status: "ACCEPTED" },
      });

      await shareService.leave(2, 1);
      expect(await prisma.listShare.findUnique({ where: { id: share.id } })).toBeNull();
    });

    it("should throw when the user has no share", async () => {
      await expect(shareService.leave(2, 1)).rejects.toThrow(DataValidationError);
    });
  });
});
