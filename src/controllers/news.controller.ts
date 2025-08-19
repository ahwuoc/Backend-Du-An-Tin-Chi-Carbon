import type { Request, Response } from "express";
import { NewsService } from "../services";

class NewsController {
  async getAllNews(req: Request, res: Response) {
    try {
      const news = await NewsService.getAllNews();
      res.status(200).json({ status: "success", data: news });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message || "Lỗi server khi lấy danh sách tin tức",
      });
    }
  }

  async getNewsById(req: Request, res: Response) {
    try {
      const news = await NewsService.getNewsById(req.params.id);
      if (!news) {
        res
          .status(404)
          .json({ status: "error", message: "Không tìm thấy tin tức" });
        return;
      }
      res.status(200).json({ status: "success", data: news });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message || "Lỗi server khi lấy chi tiết tin tức",
      });
    }
  }

  async createNews(req: Request, res: Response) {
    try {
      const newsData = req.body;
      const validationErrors = NewsService.validateNewsData(newsData);
      
      if (validationErrors.length > 0) {
        res
          .status(400)
          .json({ status: "error", message: "Dữ liệu không hợp lệ", details: validationErrors });
        return;
      }

      const savedNews = await NewsService.createNews(newsData);
      res.status(201).json({ status: "success", data: savedNews });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message || "Lỗi server khi tạo tin tức",
      });
    }
  }

  async updateNews(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const newsData = req.body;
      const validationErrors = NewsService.validateNewsData(newsData);
      
      if (validationErrors.length > 0) {
        res
          .status(400)
          .json({ status: "error", message: "Dữ liệu không hợp lệ", details: validationErrors });
        return;
      }

      const updatedNews = await NewsService.updateNews(id, newsData);

      if (!updatedNews) {
        res
          .status(404)
          .json({ status: "error", message: "Không tìm thấy tin tức" });
        return;
      }

      res.status(200).json({ status: "success", data: updatedNews });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message || "Lỗi server khi cập nhật tin tức",
      });
    }
  }

  async deleteNews(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const isDeleted = await NewsService.deleteNews(id);
      
      if (!isDeleted) {
        res
          .status(404)
          .json({ status: "error", message: "Không tìm thấy tin tức" });
        return;
      }

      res.status(200).json({ status: "success", message: "Xóa tin tức thành công" });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message || "Lỗi server khi xóa tin tức",
      });
    }
  }
}

export default new NewsController();
