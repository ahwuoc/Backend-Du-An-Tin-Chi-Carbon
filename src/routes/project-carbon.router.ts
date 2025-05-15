import express from "express";
import multer from "multer";
import ProjectCarbonController from "../controllers/project-carbon.controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});
const upload = multer({ storage: storage });
const projectFileUpload = upload.fields([
  { name: "landDocuments", maxCount: 10 },
  { name: "kmlFile", maxCount: 1 },
]);
router.post(
  "/carbon",
  projectFileUpload,
  ProjectCarbonController.createProjectCarbon
);

router.get("/carbon", ProjectCarbonController.getAllProjectCarbons);

router.get("/carbon/:id", ProjectCarbonController.getProjectCarbonById);

router.put(
  "/carbon/:id",
  projectFileUpload,
  ProjectCarbonController.updateProjectCarbon
);

router.delete("/carbon/:id", ProjectCarbonController.deleteProjectCarbon);

export default router;
