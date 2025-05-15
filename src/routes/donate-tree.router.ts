import { Router } from "express";
import DonationController from "../controllers/donate.controller";
const instance = new DonationController();
const router = Router();

router.post("/", instance.createDonation.bind(instance));
router.get("/", instance.getDonations.bind(instance));
router.get("/infor", instance.getInfoDonations.bind(instance));

export default router;
