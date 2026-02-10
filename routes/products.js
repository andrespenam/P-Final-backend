import express from "express";
import {
    getAllProducts,
    getFeaturedProducts,
    createProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protect, createProduct);

export default router;