
import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (!channel) {
    try {
      const connection = await amqp.connect(url);

      channel = await connection.createChannel();

      await channel.assertExchange("inventory.events", "topic", {
        durable: true,
      });

      await channel.assertQueue("inventory.alerts.queue", {
        durable: true,
      });

      await channel.bindQueue(
        "inventory.alerts.queue",
        "inventory.events",
        "inventory.low_stock"
      );
    
      console.log("RabbitMQ connected successfully");
    } catch  {
      console.log("RabbitMQ not ready, retrying in 5 seconds...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

export const publishEvent = async (
  routingKey: string,
  message: object
): Promise<void> => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  channel.publish(
    "inventory.events",
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};