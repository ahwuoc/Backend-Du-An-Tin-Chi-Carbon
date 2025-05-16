import { Router } from "express";
import { AffiliateTransactionController } from "../controllers/affiliate-transaction.controller";

const router = Router();

router.get("/", AffiliateTransactionController.getAll);
router.get("/:id", AffiliateTransactionController.getById);
router.post("/", AffiliateTransactionController.create);
router.put("/:id", AffiliateTransactionController.update);
router.delete("/:id", AffiliateTransactionController.delete);

export default router;
