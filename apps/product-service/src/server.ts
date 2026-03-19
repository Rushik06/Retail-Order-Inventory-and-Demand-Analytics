import app from "./app.js";
import { env } from "./config/index.js";
import { sequelize } from "./config/sequilize.js";
import { logger } from "@repo/shared";
import type { Server } from "http";

let server: Server;

async function startServer(): Promise<void> {
  try {

    await sequelize.authenticate();
    logger.info("Database connected successfully");

    server = app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, `Product service running on http://localhost:${env.PORT}`);
    });

  } catch (error) {

    logger.error({ err: error }, "Failed to start server");
    process.exit(1);

  }
}

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down product service...");

  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
});

startServer();