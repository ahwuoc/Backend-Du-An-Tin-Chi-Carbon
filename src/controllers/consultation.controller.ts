import type { Request, Response } from "express";
import Consultation from "../models/consultation";
import type { IConsultation } from "../types/consultation";
import { sendMailConsultationFeedback } from "../utils/email/emailTemplates";
import { sendEmail } from "../utils/email/sendEmail";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError, UnauthorizedError, ValidationError } from "../utils";

type OmitConsultation = Omit<IConsultation, "createdAt" | "updatedAt" | "_id">;

class ConsultationController {
  public register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { formData } = req.body;
      const {
        userId,
        name,
        phone,
        email,
        consultationType,
        age,
        location,
        area,
        message,
        organization,
        position,
        experience,
        education,
        projectType,
        projectSize,
        projectLocation,
        implementationTimeline,
        budget,
        carbonGoals,
      } = formData;

      // Validate auth
      if (!userId) {
        throw new UnauthorizedError("Vui lòng đăng nhập trước khi gửi tư vấn");
      }

      // Validate required fields
      if (!name || !phone || !email || !consultationType) {
        throw new BadRequestError(
          "Thiếu thông tin bắt buộc: name, phone, email, consultationType"
        );
      }

      // Validate consultation type
      const validTypes = ["forest", "agriculture", "biochar", "csu", "carbonbook", "other"];
      if (!validTypes.includes(consultationType)) {
        throw new ValidationError("Loại tư vấn không hợp lệ");
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ValidationError("Email không hợp lệ");
      }

      const consultationData: OmitConsultation = {
        userId,
        name,
        phone,
        email,
        consultationType,
        age: age || undefined,
        location: location || undefined,
        area: area || undefined,
        message: message || undefined,
        organization: organization || undefined,
        position: position || undefined,
        experience: experience || undefined,
        education: education || undefined,
        projectType: projectType || undefined,
        projectSize: projectSize || undefined,
        projectLocation: projectLocation || undefined,
        implementationTimeline: implementationTimeline || undefined,
        budget: budget || undefined,
        carbonGoals: carbonGoals || undefined,
        status: "pending",
      };

      const consultation = await Consultation.create(consultationData);

      sendSuccess(res, "Đăng ký tư vấn thành công", consultation, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const consultations = await Consultation.find().lean();
      sendSuccess(res, "Lấy danh sách tư vấn thành công", consultations, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { email, feedback, name } = req.body;

      if (!id) throw new BadRequestError("Consultation ID là bắt buộc");

      // Send feedback email
      const mailContent = sendMailConsultationFeedback(name, email, feedback);
      await sendEmail(email, "Phản hồi từ Tín Chỉ Carbon Việt Nam", mailContent);

      // Delete consultation
      const deleted = await Consultation.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundError("Không tìm thấy bản ghi để xóa");

      sendSuccess(res, "Phản hồi đã gửi, consultation đã được xóa", deleted, 200);
    }
  );
}

export default new ConsultationController();
