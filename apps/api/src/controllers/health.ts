import prisma from "#/prisma.js";
import { injectable } from "inversify";
import { Controller, Get, Route, Tags } from "tsoa";

interface HealthResponse {
  status: "ok";
}

@Route("health")
@Tags("Health")
@injectable()
export class HealthController extends Controller {
  @Get("/")
  public async index(): Promise<HealthResponse> {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok" };
  }
}
