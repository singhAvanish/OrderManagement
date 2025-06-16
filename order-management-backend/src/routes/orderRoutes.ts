import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderQuantity,
  deleteOrder,
} from "../controllers/orderController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", createOrder);
router.get("/", protect, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, updateOrderQuantity);
router.delete("/:id", protect, deleteOrder);

export default router;
