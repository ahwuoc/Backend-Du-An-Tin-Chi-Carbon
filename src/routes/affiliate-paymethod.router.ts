import { Router } from "express";
import AffiliatePaymentMethodController from "../controllers/affiliate-paymethod.controller";

const router = Router();
router.get("/:id", AffiliatePaymentMethodController.getAffiliatePaymentMethods);
router.post("/", AffiliatePaymentMethodController.createAffiliatePaymentMethod);
router.get(
  "/:methodId",
  AffiliatePaymentMethodController.getAffiliatePaymentMethodById
);
router.put(
  "/:methodId",
  AffiliatePaymentMethodController.updateAffiliatePaymentMethod
);
router.delete(
  "/:methodId",
  AffiliatePaymentMethodController.deleteAffiliatePaymentMethod
);
export default router;
