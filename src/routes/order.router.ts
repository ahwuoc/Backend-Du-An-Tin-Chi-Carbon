import express from "express";
import OrderController from "../controllers/order.Controller";

const router = express.Router();

router.post("/", OrderController.create);
router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getById);
router.put("/:id", OrderController.update);
router.delete("/:orderCode", OrderController.delete);
router.delete("/id/:id", OrderController.deleteId);
router.get("/user/:userId", OrderController.getProjectForOrder);
router.get("/info/:userId", OrderController.getInfo);
export default router;
