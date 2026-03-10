import app from "./app.js";
import { sequelize ,env } from "./src/config/index.js";


async function startServer(): Promise<void> {

  try {

    await sequelize.authenticate();
    console.log("Reporting DB connected successfully");

    app.listen(env.PORT, () => {
      console.log(
        `Reporting service running on http://localhost:${env.PORT}`
      );
    });

  } catch (error) {

    console.error("Failed to start reporting service:", error);
    process.exit(1);

  }

}

startServer();