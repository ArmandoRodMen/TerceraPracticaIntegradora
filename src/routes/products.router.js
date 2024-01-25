import { Router } from "express";
import {
  findProductAggregation,
  findProductById,
  updateProductById,
  createProduct,
  deleteProduct
} from "../controllers/products.controller.js";
const router = Router();

router.get("/", findProductAggregation);
router.get("/:idProduct", findProductById);
router.put("/:idProduct", updateProductById);
router.post("/", createProduct);
router.delete("/:idProduct", deleteProduct);

export default router;