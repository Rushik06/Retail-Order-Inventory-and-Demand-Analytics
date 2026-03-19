import { getChannel } from "../utils/rabbitmq.js";
import { sendLowStockNotification } from "../utils/notification-socket.js";
import { QUEUES } from "../constants/queues.js";
import { logger } from "@repo/shared";

export const startInventoryAlertConsumer = (): void => {
  const channel = getChannel();

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
};