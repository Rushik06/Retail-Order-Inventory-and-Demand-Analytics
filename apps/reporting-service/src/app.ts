import express ,{type Express} from "express";
import cors from "cors";
import morgan from "morgan";
import { setupSwagger } from "./swagger/swagger.js";
import reportRoutes from "./routes/reporting.routes.js";
import exportRoutes from "./routes/export.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app : Express = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);//swagger setup


/* ROUTES */

app.use("/api/reports", reportRoutes);
app.use("/api/reports/export", exportRoutes);

/* HEALTH CHECK */

app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "reporting-service",
    status: "running"
  });
});

/*MORGAN-LOGGER*/
app.use(morgan("dev"));


/* GLOBAL ERROR HANDLER */

app.use(errorHandler);

export default app;