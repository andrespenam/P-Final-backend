import { Router } from "express";
import {
    getAllProducts,
    createProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllProducts);
router.post("/", authMiddleware, createProduct);

export default router;
