import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import rbacRoutes from "./routes/rbac.routes.js";

import { initSwagger } from "./swagger/swaggers.js";
import {
  errorHandler,
  createVersionedRouter,
  mountVersionedRouter,
} from "@repo/shared";

const app: Express = express();

/* Security */

app.use(helmet());

const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders: false,
});

/* CORS */

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* Routes */

const v1 = createVersionedRouter();

v1.use("/auth", authLimiter, authRoutes);
v1.use("/profile", profileRoutes);
v1.use("/password", passwordRoutes);
v1.use("/rbac", rbacRoutes);

mountVersionedRouter(app, v1);

/* Swagger */

initSwagger(app);

/* Health */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "auth-service",
  });
});

/* Error handler */

app.use(errorHandler);

export default app;