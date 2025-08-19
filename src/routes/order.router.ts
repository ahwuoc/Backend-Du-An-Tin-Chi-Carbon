import express from "express";
import OrderController from "../controllers/order.controller";

const router = express.Router();

router.post("/", OrderController.create);
router.get("/", OrderController.getAllOrders);
router.get("/user/:userId", OrderController.getOrdersByUserId);
router.get("/:id", OrderController.getOrderById);
router.put("/:id", OrderController.updateOrderStatus);
router.delete("/:id", OrderController.deleteOrder);
export default router;
