import express from "express";
import ProjectCarbonController from "../controllers/project-carbon.controller";
const router = express.Router();

router.post("/", ProjectCarbonController.createProjectCarbon);
router.put("/:id", ProjectCarbonController.updateProjectCarbon);
router.get("/", ProjectCarbonController.getAllProjectCarbons);
router.get("/:id", ProjectCarbonController.getProjectCarbonById);
router.get("/profile/:id", ProjectCarbonController.getProjectByUser);
export default router;
