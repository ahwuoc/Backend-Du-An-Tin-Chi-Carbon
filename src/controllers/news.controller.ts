import type { Request, Response } from "express";
import News from "../models/news.model";

class NewsController {
  async getAllNews(req: Request, res: Response) {
    try {
      const news = await News.find()
        .sort({ createdAt: -1 })
        .populate("userId", "name");
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
      console.log("req.params.id", req.params.id);
      const news = await News.findById(req.params.id);
      if (!news) {
        res
          .status(404)
          .json({ status: "error", message: "Không tìm thấy tin tức" });
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
      const { title, content, userId, category, status, image, tags } =
        req.body;
      console.log(req.body);
      if (!title || !content || !userId || !category) {
        res
          .status(400)
          .json({ status: "error", message: "Thiếu thông tin bắt buộc" });
      }

      const newNews = new News({
        title,
        content,
        userId,
        category,
        status,
        image,
        tags,
      });

      const savedNews = await newNews.save();
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
      const { title, content, userId, category, status, image, tags } =
        req.body;

      if (!title || !content || !userId || !category || !status) {
        res
          .status(400)
          .json({ status: "error", message: "Thiếu thông tin bắt buộc" });
      }

      const updatedNews = await News.findByIdAndUpdate(
        req.params.id,
        { title, content, userId, category, status, image, tags },
        { new: true, runValidators: true }
      );

      if (!updatedNews) {
        res
          .status(404)
          .json({ status: "error", message: "Không tìm thấy tin tức" });
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
      const deletedNews = await News.findByIdAndDelete(req.params.id);

      if (!deletedNews) {
        res
          .status(404)
          .json({ status: "error", message: "Không tìm thấy tin tức" });
      }

      res
        .status(200)
        .json({ status: "success", message: "Xóa tin tức thành công" });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message || "Lỗi server khi xóa tin tức",
      });
    }
  }
}

export default new NewsController();
