import type { Request, Response } from "express";
import { ConsultationService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError, UnauthorizedError } from "../utils";

/**
 * Consultation Controller
 */
class ConsultationController {
  public register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { formData } = req.body;

      if (!formData.userId) {
        throw new UnauthorizedError("Vui lòng đăng nhập trước khi gửi tư vấn");
      }

      if (!formData.name || !formData.phone || !formData.email || !formData.consultationType) {
        throw new BadRequestError(
          "Thiếu thông tin bắt buộc: name, phone, email, consultationType"
        );
      }

      const consultation = await ConsultationService.create(formData);
      sendSuccess(res, "Đăng ký tư vấn thành công", consultation, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const consultations = await ConsultationService.getAll();
      sendSuccess(res, "Lấy danh sách tư vấn thành công", consultations, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { email, feedback, name } = req.body;

      if (!id) throw new BadRequestError("Consultation ID là bắt buộc");

      const deleted = await ConsultationService.deleteWithFeedback(id, {
        name,
        email,
        feedback,
      });

      sendSuccess(res, "Phản hồi đã gửi, consultation đã được xóa", deleted, 200);
    }
  );
}

export default new ConsultationController();
