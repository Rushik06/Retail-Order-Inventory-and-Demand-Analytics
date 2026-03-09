import app from './app.js';
import { env } from './config/index.js';
import { sequelize } from "./config/sequilize.js";
import { connectRabbitMQ } from './utils/rabbitmq.js';

import http from "http";
import { initNotificationSocket } from "./utils/notification-socket.js";
import { startInventoryAlertConsumer } from "./services/consumer.js";

async function startServer(): Promise<void> {

  try {

    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync();
    console.log('Database synced successfully');

    await connectRabbitMQ();

    const server = http.createServer(app);

    initNotificationSocket(server);
    
    server.listen(env.PORT, () => {
      console.log(`Inventory service running on http://localhost:${env.PORT}`);
    });

    startInventoryAlertConsumer();


  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }

}
startServer();