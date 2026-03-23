import amqp from "amqplib";
import { logger } from "@repo/shared";
import { QUEUES } from "../constants/queues.js";

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (!channel) {
    try {
      const connection = await amqp.connect(url);
      channel = await connection.createChannel();

      // ----------- INVENTORY EXCHANGE (alerts) -----------
      await channel.assertExchange(QUEUES.EXCHANGE, "topic", { durable: true });

      await channel.assertExchange(QUEUES.DLX, "direct", { durable: true });
      await channel.assertQueue(QUEUES.DLQ, { durable: true });
      await channel.bindQueue(QUEUES.DLQ, QUEUES.DLX, QUEUES.DLQ_ROUTING_KEY);

      try {
        await channel.deleteQueue(QUEUES.QUEUE, { ifUnused: false, ifEmpty: false });
      } catch {
        // queue may not exist yet
      }

      await channel.assertQueue(QUEUES.QUEUE, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": QUEUES.DLX,
          "x-dead-letter-routing-key": QUEUES.DLQ_ROUTING_KEY,
        },
      });

      await channel.bindQueue(QUEUES.QUEUE, QUEUES.EXCHANGE, "inventory.low_stock");

      // ----------- ORDERS EXCHANGE (order created) -----------
      await channel.assertExchange("orders", "topic", { durable: true });
      await channel.assertQueue("inventory.order.created", { durable: true });
      await channel.bindQueue("inventory.order.created", "orders", "order.created");

      logger.info("RabbitMQ connected successfully");

      connection.on("error", (err) => {
        logger.error({ err }, "RabbitMQ connection error");
      });

      connection.on("close", () => {
        logger.warn("RabbitMQ connection closed");
        channel = null;
      });

    } catch (error) {
      logger.warn({ err: error }, "RabbitMQ not ready, retrying in 5 seconds...");
      channel = null;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};

export const publishEvent = async (
  routingKey: string,
  message: object
): Promise<void> => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  channel.publish(
    QUEUES.EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};