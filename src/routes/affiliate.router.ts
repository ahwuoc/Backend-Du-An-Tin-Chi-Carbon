import express from "express";
import { affiliateController } from "../controllers/affiliate.controller";

const router = express.Router();

router.post("/", affiliateController.createAffiliate);

router.get("/", affiliateController.getAllAffiliates);

router.get("/:id", affiliateController.getAffiliateByUserId);

router.patch("/:id", affiliateController.updateAffiliate);

router.delete("/:id", affiliateController.deleteAffiliate);

export default router;
