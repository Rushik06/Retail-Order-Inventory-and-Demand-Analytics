import amqp from "amqplib";
import { sendLowStockNotification } from "../utils/notification-socket.js";
import { QUEUES } from "../constants/queues.js";
import { logger } from "@repo/shared";

export const startInventoryAlertConsumer = async () => {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  try {
    const connection = await amqp.connect(url);

    connection.on("error", (err) => {
      logger.error({ err }, "RabbitMQ connection error");
    });

    connection.on("close", () => {
      logger.info("RabbitMQ connection closed");
    });

    const channel = await connection.createChannel();

    logger.info("Inventory alert consumer started");

    channel.consume(QUEUES.QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());
        logger.info({ event }, "Low stock event received");

        if (event.event === "LOW_STOCK" || event.event === "STOCK_RECOVERED") {
          await sendLowStockNotification(event);
        }

        channel.ack(msg);
      } catch (error) {
        logger.error({ err: error }, "Failed processing alert event");
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start inventory alert consumer");
  }
};