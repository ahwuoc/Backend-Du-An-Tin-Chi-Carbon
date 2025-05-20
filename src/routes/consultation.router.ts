import { Router } from "express";
import {
  registerConsultation,
  getAllConsultation,
  deleteConsultation,
} from "../controllers/consultationController";

const router = Router();

router.post("/register", registerConsultation);
router.get("/getall", getAllConsultation);
router.delete("/:id", deleteConsultation);
export default router;
