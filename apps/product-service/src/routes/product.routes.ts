import { Router } from "express";
import * as controller from "../controllers/product.controller.js";
import { authorize} from "../middleware/authorize.js";

const router:Router = Router();

router.post("/", authorize("ADMIN", "MANAGER"), controller.createProduct);
router.get("/", authorize("ADMIN", "MANAGER", "STAFF"), controller.getProducts);
router.patch("/:id", authorize("ADMIN", "MANAGER"), controller.updateProduct);
router.delete("/:id", authorize("ADMIN"), controller.deleteProduct);

export default router;