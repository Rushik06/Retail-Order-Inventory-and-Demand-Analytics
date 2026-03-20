import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {  errorHandler } from "@repo/shared";
import { setupSwagger } from "./swagger/swagger.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";

const app: Express = express();

/* Security */

app.use(helmet());

const limiter = rateLimit({
 windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
 max: Number(process.env.RATE_LIMIT_MAX) 
});

app.use(limiter);

/* CORS */

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use(morgan("dev"));

/* Health */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "inventory-service",
  });
});

/* Routes */

app.use("/api/inventory", authenticate, inventoryRoutes);
app.use("/api/warehouse", authenticate, warehouseRoutes);

/* Error handler */

app.use(errorHandler);

export default app;