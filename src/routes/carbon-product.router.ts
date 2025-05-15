import { Router } from "express";
import {
  createCarbonProduct,
  getAllCarbonProducts,
  getCarbonProductById,
} from "../controllers/carbonproduct.controller";

const router = Router();

router.post("/", createCarbonProduct);
router.get("/", getAllCarbonProducts);
router.get("/:id", getCarbonProductById);

export default router;
