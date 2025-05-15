import { Router } from "express";
import {
  registerConsultation,
  getAllConsultation,
} from "../controllers/consultationController";

const router = Router();

router.post("/register", registerConsultation);
router.get("/getall", getAllConsultation);
export default router;
