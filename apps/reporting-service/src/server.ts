import app from "./app.js";
import { sequelize, env } from "./config/index.js";
import { logger } from "@repo/shared";
import type { Server } from "http";

let server: Server;

async function startServer(): Promise<void> {
  try {

    await sequelize.authenticate();
    logger.info("Reporting DB connected successfully");

    server = app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, `Reporting service running on http://localhost:${env.PORT}`);
    });

  } catch (error) {

    logger.error({ err: error }, "Failed to start reporting service");
    process.exit(1);

  }
}

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down reporting service...");

  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
});

startServer();