import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser"; 

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import rbacRoutes from "./routes/rbac.routes.js";

import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { setupSwagger } from "./swagger/swaggers.js";
import { errorHandler } from "@repo/shared";

const app: Express = express();

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

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // ← add — must be after express.json()

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/rbac", rbacRoutes);

setupSwagger(app);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "auth-service",
  });
});

app.use(errorHandler);

export default app;