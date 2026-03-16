import app from "./app.js";
import { sequelize, env } from "./config/index.js";
import type { Server } from "http";

let server: Server;

async function startServer(): Promise<void> {
  try {

    await sequelize.authenticate();
    console.log("Reporting DB connected successfully");

    server = app.listen(env.PORT, () => {
      console.log(`Reporting service running on http://localhost:${env.PORT}`);
    });

  } catch (error) {

    console.error("Failed to start reporting service:", error);
    process.exit(1);

  }
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down reporting service...");

  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
});

startServer();