import express from "express";
import projectController from "../controllers/project.controller";

const router = express.Router();

router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.get("/profile/:id", projectController.getUserProfileProject);
export default router;
