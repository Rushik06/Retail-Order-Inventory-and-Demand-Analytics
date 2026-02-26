import express ,{type Express} from "express";
import cors from "cors";
import morgan from "morgan";
import productServiceRoutes from "./routes/product.routes.js";
import { setupSwagger } from "./swagger/swagger.js";
import orderRoutes from "./routes/order.routes.js";
import { authenticate } from "./middleware/authenticate.js";

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
app.use("/api/products", authenticate, productServiceRoutes);
app.use("/api/orders", authenticate, orderRoutes);  

export default app;