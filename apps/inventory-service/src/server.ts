import app from "./app.js";
import { env } from "./config/index.js";
import { sequelize } from "./config/sequilize.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

import http from "http";
import { initNotificationSocket } from "./utils/notification-socket.js";
import { startInventoryAlertConsumer } from "./services/consumer.js";

let server: http.Server;

async function startServer(): Promise<void> {

  try {

    await sequelize.authenticate();
    console.log("Database connected successfully");

    await connectRabbitMQ();

    server = http.createServer(app);

    initNotificationSocket(server);

    server.listen(env.PORT, () => {
      console.log(`Inventory service running on http://localhost:${env.PORT}`);
    });

    startInventoryAlertConsumer();

  } catch (error) {

    console.error("Failed to start server:", error);
    process.exit(1);

  }

}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down inventory service...");

  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
});

startServer();