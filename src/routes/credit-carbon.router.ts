import { Router } from "express";
import { CarbonCreditController } from "../controllers/credit-carbon.controller";

const router = Router();

router.get("/", CarbonCreditController.getAll);
router.get("/:id", CarbonCreditController.getById);
router.post("/", CarbonCreditController.create);
router.put("/:id", CarbonCreditController.update);
router.delete("/:id", CarbonCreditController.delete);

export default router;
