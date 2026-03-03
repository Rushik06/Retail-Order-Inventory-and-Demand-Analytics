import express ,{type Express} from "express";
import cors from "cors";
import morgan from "morgan";
import { setupSwagger } from "./swagger/swagger.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js"
import { authenticate } from "./middleware/auth.middleware.js";

const app: Express = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);//swagger setup

//morgan logger
app.use(morgan("dev"));

//health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

//API Routes
app.use("/api/inventory", authenticate, inventoryRoutes);
app.use("/api/warehouse", authenticate, warehouseRoutes);

export default app;