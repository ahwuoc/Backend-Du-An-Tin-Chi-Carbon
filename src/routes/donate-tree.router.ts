import { Router } from "express";
import DonationController from "../controllers/donate-tree.controller";

const router = Router();

router.post("/", DonationController.createDonation);
router.get("/", DonationController.getDonations);
router.get("/infor", DonationController.getInfoDonations);
router.get("/orderCode/:id", DonationController.getDonationAndUpdateStatus);
router.put("/:id", DonationController.updateDonations);
router.delete("/:id", DonationController.deleteDonations);
export default router;
