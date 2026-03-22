import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import productServiceRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { authenticate } from "./middleware/authenticate.js";
import { setupSwagger } from "./swagger/swagger.js";
import {
  errorHandler,
  createVersionedRouter,
  mountVersionedRouter,
} from "@repo/shared";

const app: Express = express();

/* Security */

app.use(helmet());

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX),
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

/* Swagger */

setupSwagger(app);

app.use(morgan("dev"));

/* Health */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "product-service",
  });
});

/* Routes */

const v1 = createVersionedRouter();

v1.use("/products", authenticate, productServiceRoutes);
v1.use("/orders", authenticate, orderRoutes);

mountVersionedRouter(app, v1);

/* Error handler */

app.use(errorHandler);

export default app;