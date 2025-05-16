import express from "express";
import { CertificateController } from "../controllers/certificate.controller";

const router = express.Router();

router.get("/", CertificateController.getAll);
router.get("/:id", CertificateController.getById);
router.post("/", CertificateController.create);
router.put("/:id", CertificateController.update);
router.delete("/:id", CertificateController.delete);

export default router;
