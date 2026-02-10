import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);

export default router;