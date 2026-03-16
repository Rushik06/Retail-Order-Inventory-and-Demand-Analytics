import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { setupSwagger } from "./swagger/swagger.js";
import reportRoutes from "./routes/reporting.routes.js";
import exportRoutes from "./routes/export.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app: Express = express();

/* Security */

app.use(helmet());

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX)
});

app.use(limiter);

/* Middleware */

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

/* Routes */

app.use("/api/reports", reportRoutes);
app.use("/api/reports/export", exportRoutes);

/* Health */

app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "reporting-service",
    status: "running",
  });
});

/* Error handler */

app.use(errorHandler);

export default app;