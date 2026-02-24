import app from './app.js';
import {  env } from './config/index.js';
import { sequelize } from "@retail/database";

async function startServer(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync();
    console.log('Database synced successfully');

    app.listen(env.PORT, () => {
      console.log(`Product service running on http://localhost:${env.PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();