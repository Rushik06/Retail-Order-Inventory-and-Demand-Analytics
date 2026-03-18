import {Server as HTTPServer} from "http";
import { Server } from "socket.io";
import type { LowStockEvent } from "../types/notification.types.js";

let io: Server | null = null;

export const initNotificationSocket = (server: HTTPServer) => {

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
    },
    transports: ["websocket", "polling"]
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });

};

export const sendLowStockNotification = async (event: LowStockEvent) => {

  if (!io) return;

  io.emit("inventory.low_stock", {
    productId: event.productId,
    warehouseId: event.warehouseId,
    currentQty: event.currentQty,
    threshold: event.threshold,
    message: `Low stock detected (Qty: ${event.currentQty})`
  });

};