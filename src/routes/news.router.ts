import { Router } from "express";
import NewsController from "../controllers/news.controller";
const router = Router();
router.get("/", NewsController.getAllNews);
router.get("/:id", NewsController.getNewsById);
router.post("/", NewsController.createNews);
router.put("/:id", NewsController.updateNews);
router.delete("/:id", NewsController.deleteNews);

export default router;
