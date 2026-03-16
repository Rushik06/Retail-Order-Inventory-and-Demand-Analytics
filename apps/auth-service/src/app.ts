import express from "express";
import type { Express } from "express";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import rbacRoutes from "./routes/rbac.routes.js";

import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { setupSwagger } from "./swagger/swaggers.js";

const app: Express = express();

/* Security Headers */

app.use(helmet());

/* Global rate limiter */

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

/* Auth specific limiter */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

/* CORS */

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

/* Routes */

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/rbac", rbacRoutes);

setupSwagger(app);

/* Health check */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "auth-service",
  });
});

export default app;