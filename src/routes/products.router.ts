import express from "express";
import productController from "../controllers/product.controller";

const router = express.Router();

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.put("/timelines/:id", productController.updateTimeline);
router.put("/reports/:id", productController.updateReports);
router.put("/features/:id", productController.updateFeatures);
router.put("/benefits/:id", productController.updateBenefits);

router.put("/certificates/:id", productController.updateCertificates);
router.delete("/:id", productController.deleteProduct);
router.get("/free/trial", productController.getFreeTrialProduct);

export default router;
