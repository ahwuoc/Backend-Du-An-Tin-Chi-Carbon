import express from "express";
import projectController from "../controllers/project.controller";

const router = express.Router();

router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.get("/profile/:id", projectController.getUserProfileProject);
router.put("/activities/:id", projectController.updateActivities);
router.put("/documents/:id", projectController.updateDocuments);
router.put(
  "/documents/:projectId/:documentId/status",
  projectController.updateDocumentsStatus,
);

export default router;
