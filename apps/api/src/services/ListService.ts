import { DatabaseLimitError } from "#/errors/DatabaseLimitError.js";
import { type List } from "#/generated/prisma/client.js";
import prisma from "#/prisma.js";
import { type ListAccess } from "#/services/ListAccessService.js";

export type ListWithAccess = List & { permission: ListAccess; isShared: boolean; ownerUsername: string };

export interface IListService {
  listForUser(userId: number): Promise<ListWithAccess[]>;
  create(userId: number, data: Pick<List, "name" | "color"> & { type?: List["type"] }): Promise<List>;
  update(
    userId: number,
    listId: number,
    data: Partial<Pick<List, "name" | "color" | "type">>,
  ): Promise<List & { isShared: boolean }>;
  delete(userId: number, listId: number): Promise<List>;
}

import { injectable } from "inversify";

@injectable()
export class ListService implements IListService {
  public async listForUser(userId: number): Promise<ListWithAccess[]> {
    const lists = await prisma.list.findMany({
      where: {
        OR: [{ userId }, { shares: { some: { userId, status: "ACCEPTED" } } }],
      },
      include: { user: { select: { username: true } }, shares: true },
      orderBy: { name: "asc" },
    });

    return lists.map(({ user: owner, shares, ...list }) => {
      const ownShare = shares.find((share) => share.userId === userId);
      return {
        ...list,
        permission: list.userId === userId ? "OWNER" : ownShare?.permission === "WRITE" ? "WRITE" : "READ",
        isShared: shares.some((share) => share.status === "ACCEPTED"),
        ownerUsername: owner.username,
      };
    });
  }

  public async create(userId: number, data: Pick<List, "name" | "color"> & { type?: List["type"] }): Promise<List> {
    const amount = await prisma.list.count({
      where: { userId },
    });
    if (amount >= 10) {
      throw new DatabaseLimitError("Je mag maximaal 10 lijsten hebben.");
    }

    return await prisma.list.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  public async update(
    userId: number,
    listId: number,
    data: Partial<Pick<List, "name" | "color" | "type">>,
  ): Promise<List & { isShared: boolean }> {
    const { shares, ...list } = await prisma.list.update({
      data,
      where: { id: listId, userId },
      include: { shares: { where: { status: "ACCEPTED" } } },
    });
    return { ...list, isShared: shares.length > 0 };
  }

  public async delete(userId: number, listId: number): Promise<List> {
    const amount = await prisma.list.count({
      where: { userId },
    });
    if (amount <= 1) {
      throw new DatabaseLimitError("Je moet minimaal 1 lijst hebben.");
    }

    return await prisma.list.delete({ where: { id: listId, userId } });
  }
}
