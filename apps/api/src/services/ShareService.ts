import { DataValidationError } from "#/errors/DataValidationError.js";
import { DatabaseLimitError } from "#/errors/DatabaseLimitError.js";
import { type ListShare, Prisma, type SharePermission } from "#/generated/prisma/client.js";
import prisma from "#/prisma.js";
import { ListAccessService } from "#/services/ListAccessService.js";
import { MailService } from "#/services/MailService.js";
import { inject, injectable } from "inversify";

export type Invitation = ListShare & { listName: string; listColor: string; ownerUsername: string };

export interface IShareService {
  listForList(userId: number, listId: number): Promise<ListShare[]>;
  create(
    user: { id: number; email: string; username: string },
    listId: number,
    data: { email: string; permission: SharePermission },
  ): Promise<ListShare>;
  updatePermission(userId: number, shareId: number, permission: SharePermission): Promise<ListShare>;
  revoke(userId: number, shareId: number): Promise<ListShare>;
  invitationsForUser(userId: number): Promise<Invitation[]>;
  accept(userId: number, listId: number): Promise<ListShare>;
  leave(userId: number, listId: number): Promise<ListShare>;
}

@injectable()
export class ShareService implements IShareService {
  constructor(
    @inject(MailService) private mailService: MailService,
    @inject(ListAccessService) private listAccessService: ListAccessService,
  ) {}

  public async listForList(userId: number, listId: number): Promise<ListShare[]> {
    await this.listAccessService.requireAccess(userId, listId, "OWNER");
    return await prisma.listShare.findMany({ where: { listId }, orderBy: { email: "asc" } });
  }

  public async create(
    user: { id: number; email: string; username: string },
    listId: number,
    data: { email: string; permission: SharePermission },
  ): Promise<ListShare> {
    await this.listAccessService.requireAccess(user.id, listId, "OWNER");
    const email = data.email.toLowerCase().trim();

    const invitee = await prisma.user.findUnique({ where: { email } });
    if (invitee?.id === user.id || email === user.email.toLowerCase()) {
      throw new DataValidationError("Je kan een lijst niet met jezelf delen.");
    }

    const existing = await prisma.listShare.findFirst({ where: { listId, email } });
    if (existing) throw new DataValidationError("Deze lijst is al gedeeld met dit e-mailadres.");

    const amount = await prisma.listShare.count({ where: { listId } });
    if (amount >= 10) throw new DatabaseLimitError("Je kan een lijst met maximaal 10 personen delen.");

    let share: ListShare;
    try {
      share = await prisma.listShare.create({
        data: { listId, email, userId: invitee?.id ?? null, permission: data.permission },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new DataValidationError("Deze lijst is al gedeeld met dit e-mailadres.");
      }
      throw error;
    }

    if (invitee) {
      const list = await prisma.list.findUnique({ where: { id: listId } });
      await this.mailService.sendShareInvitationMail(invitee, user.username, list?.name ?? "");
    }

    return share;
  }

  public async updatePermission(userId: number, shareId: number, permission: SharePermission): Promise<ListShare> {
    const share = await this.getOwnedShare(userId, shareId);
    return await prisma.listShare.update({ where: { id: share.id }, data: { permission } });
  }

  public async revoke(userId: number, shareId: number): Promise<ListShare> {
    const share = await this.getOwnedShare(userId, shareId);
    return await prisma.listShare.delete({ where: { id: share.id } });
  }

  public async invitationsForUser(userId: number): Promise<Invitation[]> {
    const shares = await prisma.listShare.findMany({
      where: { userId, status: "PENDING" },
      include: { list: { include: { user: { select: { username: true } } } } },
      orderBy: { createdAt: "asc" },
    });

    return shares.map(({ list, ...share }) => ({
      ...share,
      listName: list.name,
      listColor: list.color,
      ownerUsername: list.user.username,
    }));
  }

  public async accept(userId: number, listId: number): Promise<ListShare> {
    const share = await prisma.listShare.findFirst({
      where: { listId, userId, status: "PENDING" },
    });
    if (!share) throw new DataValidationError("Uitnodiging niet gevonden.");

    return await prisma.listShare.update({ where: { id: share.id }, data: { status: "ACCEPTED" } });
  }

  public async leave(userId: number, listId: number): Promise<ListShare> {
    const share = await prisma.listShare.findFirst({ where: { listId, userId } });
    if (!share) throw new DataValidationError("Gedeelde lijst niet gevonden.");

    return await prisma.listShare.delete({ where: { id: share.id } });
  }

  private async getOwnedShare(userId: number, shareId: number): Promise<ListShare> {
    const share = await prisma.listShare.findUnique({ where: { id: shareId } });
    if (!share) throw new DataValidationError("Gedeelde lijst niet gevonden.");
    await this.listAccessService.requireAccess(userId, share.listId, "OWNER");
    return share;
  }
}
