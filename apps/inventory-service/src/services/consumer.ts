import amqp from "amqplib";
import { sendLowStockNotification } from "../utils/notification-socket.js";
import { QUEUES } from "../constants/queues.js";

export const startInventoryAlertConsumer = async () => {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  try {
    const connection = await amqp.connect(url);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
    });

    connection.on("close", () => {
      console.log("RabbitMQ connection closed");
    });

    const channel = await connection.createChannel();

    console.log("Inventory alert consumer started");

    channel.consume(QUEUES.QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());
        console.log("LOW STOCK EVENT RECEIVED:", event);

        if (event.event === "LOW_STOCK" || event.event === "STOCK_RECOVERED") {
          await sendLowStockNotification(event);
        }

        channel.ack(msg);
      } catch (error) {
        console.error("Failed processing alert event", error);
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error("Failed to start inventory alert consumer:", error);
  }
};