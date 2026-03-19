import amqp from "amqplib";
import { logger } from "@repo/shared";

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (!channel) {
    try {
      const connection = await amqp.connect(url);
      channel = await connection.createChannel();

      await channel.assertExchange("orders", "topic", { durable: true });

      logger.info("Product service RabbitMQ connected");

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

export const publishOrderCreated = async (payload: {
  orderId: string;
  items: { productId: string; quantity: number }[];
}): Promise<void> => {

  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  channel.publish(
    "orders",
    "order.created",
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );

  logger.info({ orderId: payload.orderId }, "ORDER_CREATED event published");
};