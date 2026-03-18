import amqp from "amqplib";
import { QUEUES } from "../constants/queues.js";

let channel: amqp.Channel | null = null;


export const connectRabbitMQ = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (!channel) {
    try {
      const connection = await amqp.connect(url);
      channel = await connection.createChannel();

      // Main exchange
      await channel.assertExchange(QUEUES.EXCHANGE, "topic", { durable: true });

      // Dead Letter Exchange + Queue
      await channel.assertExchange(QUEUES.DLX, "direct", { durable: true });
      await channel.assertQueue(QUEUES.DLQ, { durable: true });
      await channel.bindQueue(QUEUES.DLQ, QUEUES.DLX, QUEUES.DLQ_ROUTING_KEY);

      try {
        await channel.deleteQueue(QUEUES.QUEUE, { ifUnused: false, ifEmpty: false });
      } catch {
        
      }

      // Main queue(where it is wired to DLX send rejected messages to DLQ)
      await channel.assertQueue(QUEUES.QUEUE, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": QUEUES.DLX,
          "x-dead-letter-routing-key": QUEUES.DLQ_ROUTING_KEY,
        },
      });

      await channel.bindQueue(QUEUES.QUEUE, QUEUES.EXCHANGE, "inventory.low_stock");

      console.log("RabbitMQ connected successfully");
  
    } catch {
      console.log("RabbitMQ not ready, retrying in 5 seconds...");
      channel = null; 
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
    QUEUES.EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};