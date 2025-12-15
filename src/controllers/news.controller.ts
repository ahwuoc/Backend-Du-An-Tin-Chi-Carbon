import type { Request, Response } from "express";
import { NewsService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError, ValidationError } from "../utils";

class NewsController {
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const news = await NewsService.getAllNews();
      sendSuccess(res, "Lấy danh sách tin tức thành công", news, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("News ID là bắt buộc");

      const news = await NewsService.getNewsById(id);
      if (!news) throw new NotFoundError("Không tìm thấy tin tức");

      sendSuccess(res, "Lấy tin tức thành công", news, 200);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newsData = req.body;
      const validationErrors = NewsService.validateNewsData(newsData);

      if (validationErrors.length > 0) {
        throw new ValidationError("Dữ liệu không hợp lệ", validationErrors);
      }

      const savedNews = await NewsService.createNews(newsData);
      sendSuccess(res, "Tạo tin tức thành công", savedNews, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("News ID là bắt buộc");

      const newsData = req.body;
      const validationErrors = NewsService.validateNewsData(newsData);

      if (validationErrors.length > 0) {
        throw new ValidationError("Dữ liệu không hợp lệ", validationErrors);
      }

      const updatedNews = await NewsService.updateNews(id, newsData);
      if (!updatedNews) throw new NotFoundError("Không tìm thấy tin tức");

      sendSuccess(res, "Cập nhật tin tức thành công", updatedNews, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("News ID là bắt buộc");

      const isDeleted = await NewsService.deleteNews(id);
      if (!isDeleted) throw new NotFoundError("Không tìm thấy tin tức");

      sendSuccess(res, "Xóa tin tức thành công", null, 200);
    }
  );
}

export default new NewsController();
