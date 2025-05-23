import { Router } from "express";
import DonationController from "../controllers/donate.controller";

const router = Router();

router.post("/", DonationController.createDonation);
router.get("/orderCode/:id", DonationController.getDonationAndUpdateStatus);
router.get("/", DonationController.getDonations);
router.get("/infor", DonationController.getInfoDonations);
router.delete("/:id", DonationController.deleteDonations);
router.put("/:id", DonationController.updateDonations);
export default router;
