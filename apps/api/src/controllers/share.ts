import { injectable } from "inversify";
import { ShareService } from "#/services/ShareService.js";
import { getAuthenticatedUser, getAuthenticatedUserId } from "#/utils/auth.js";
import { type Request as ExRequest } from "express";
import { Body, Controller, Delete, Get, Path, Post, Request, Route, Security, Tags } from "tsoa";
import type { SharePermission, ShareStatus } from "../generated/prisma/enums.js";

interface ShareRequest {
  /**
   * @pattern ^[^\s@]+@[^\s@]+\.[^\s@]+$ Ongeldig e-mailadres
   * @maxLength 255
   */
  email: string;
  permission: SharePermission;
}

interface SharePermissionRequest {
  permission: SharePermission;
}

interface ShareResponse {
  id: number;
  listId: number;
  email: string;
  permission: SharePermission;
  status: ShareStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface InvitationResponse {
  id: number;
  listId: number;
  listName: string;
  listColor: string;
  ownerUsername: string;
  permission: SharePermission;
  createdAt: Date;
}

@Route("shares")
@Tags("Share")
@Security("session")
@injectable()
export class ShareController extends Controller {
  constructor(private shareService: ShareService) {
    super();
  }

  @Get("invitations")
  public async invitations(@Request() request: ExRequest): Promise<InvitationResponse[]> {
    const userId = getAuthenticatedUserId(request);
    return await this.shareService.invitationsForUser(userId);
  }

  @Get("list/{listId}")
  public async indexForList(@Request() request: ExRequest, @Path() listId: number): Promise<ShareResponse[]> {
    const userId = getAuthenticatedUserId(request);
    return await this.shareService.listForList(userId, listId);
  }

  @Post("list/{listId}")
  public async store(
    @Request() request: ExRequest,
    @Path() listId: number,
    @Body() body: ShareRequest,
  ): Promise<ShareResponse> {
    const user = getAuthenticatedUser(request);
    return await this.shareService.create(user, listId, body);
  }

  @Post("list/{listId}/accept")
  public async accept(@Request() request: ExRequest, @Path() listId: number): Promise<boolean> {
    const userId = getAuthenticatedUserId(request);
    await this.shareService.accept(userId, listId);
    return true;
  }

  @Delete("list/{listId}/leave")
  public async leave(@Request() request: ExRequest, @Path() listId: number): Promise<boolean> {
    const userId = getAuthenticatedUserId(request);
    await this.shareService.leave(userId, listId);
    return true;
  }

  @Post("{shareId}")
  public async update(
    @Request() request: ExRequest,
    @Path() shareId: number,
    @Body() body: SharePermissionRequest,
  ): Promise<ShareResponse> {
    const userId = getAuthenticatedUserId(request);
    return await this.shareService.updatePermission(userId, shareId, body.permission);
  }

  @Delete("{shareId}")
  public async destroy(@Request() request: ExRequest, @Path() shareId: number): Promise<boolean> {
    const userId = getAuthenticatedUserId(request);
    await this.shareService.revoke(userId, shareId);
    return true;
  }
}
