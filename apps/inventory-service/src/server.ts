import app from "./app.js";
import { env } from "./config/index.js";
import { sequelize } from "./config/sequilize.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";
import { logger } from "@repo/shared";

import http from "http";
import { initNotificationSocket } from "./utils/notification-socket.js";
import { startInventoryAlertConsumer } from "./services/consumer.js";

let server: http.Server;

async function startServer(): Promise<void> {
  try {

    await sequelize.authenticate();
    logger.info("Database connected successfully");

    await connectRabbitMQ();

    server = http.createServer(app);

    initNotificationSocket(server);

    server.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, `Inventory service running on http://localhost:${env.PORT}`);
    });

    startInventoryAlertConsumer();

  } catch (error) {

    logger.error({ err: error }, "Failed to start server");
    process.exit(1);

  }
}

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down inventory service...");

  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
});

startServer();