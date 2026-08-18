import { DataValidationError } from "#/errors/DataValidationError.js";
import prisma from "#/prisma.js";
import { injectable } from "inversify";

export type ListAccess = "OWNER" | "WRITE" | "READ";

const ranks: Record<ListAccess, number> = { READ: 0, WRITE: 1, OWNER: 2 };

export interface IListAccessService {
  getAccess(userId: number, listId: number): Promise<ListAccess | null>;
  requireAccess(userId: number, listId: number, minimum: ListAccess): Promise<ListAccess>;
}

@injectable()
export class ListAccessService implements IListAccessService {
  public async getAccess(userId: number, listId: number): Promise<ListAccess | null> {
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { shares: { where: { userId, status: "ACCEPTED" } } },
    });
    if (!list) return null;
    if (list.userId === userId) return "OWNER";

    const share = list.shares[0];
    if (!share) return null;
    return share.permission === "WRITE" ? "WRITE" : "READ";
  }

  public async requireAccess(userId: number, listId: number, minimum: ListAccess): Promise<ListAccess> {
    const access = await this.getAccess(userId, listId);
    if (!access || ranks[access] < ranks[minimum]) {
      throw new DataValidationError("Lijst niet gevonden.");
    }
    return access;
  }
}
