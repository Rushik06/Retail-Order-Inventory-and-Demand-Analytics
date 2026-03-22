import { Router } from "express";
import type { Express, IRouter } from "express";

export const API_VERSION = "v1" as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;

export function createVersionedRouter(): IRouter {
  return Router();
}

export function mountVersionedRouter(app: Express, router: IRouter): void {
  app.use(API_PREFIX, router);
}