import express from "express";
import ProjectCarbonController from "../controllers/project-carbon.controller";
const router = express.Router();

router.post("/", ProjectCarbonController.createProjectCarbon;
router.put("/:id", projectController.updateProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.get("/profile/:id", projectController.getUserProfileProject);
export default router;
