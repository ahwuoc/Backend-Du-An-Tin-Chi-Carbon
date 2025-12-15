import Consultation from "../models/consultation";
import { sendMailConsultationFeedback } from "../utils/email/emailTemplates";
import { sendEmail } from "../utils/email/sendEmail";
import { NotFoundError, BadRequestError, UnauthorizedError, ValidationError } from "../utils";

export interface ICreateConsultationInput {
  userId: string;
  name: string;
  phone: string;
  email: string;
  consultationType: "forest" | "agriculture" | "biochar" | "csu" | "carbonbook" | "other";
  age?: number;
  location?: string;
  area?: string;
  message?: string;
  organization?: string;
  position?: string;
  experience?: string;
  education?: string;
  projectType?: string;
  projectSize?: string;
  projectLocation?: string;
  implementationTimeline?: string;
  budget?: string;
  carbonGoals?: string;
}

export interface IDeleteConsultationInput {
  name: string;
  email: string;
  feedback: string;
}

class ConsultationService {
  async getAll() {
    return Consultation.find().lean();
  }

  async getById(id: string) {
    const consultation = await Consultation.findById(id).lean();
    if (!consultation) {
      throw new NotFoundError("Không tìm thấy tư vấn");
    }
    return consultation;
  }

  async create(data: ICreateConsultationInput) {
    // Validate consultation type
    const validTypes = ["forest", "agriculture", "biochar", "csu", "carbonbook", "other"];
    if (!validTypes.includes(data.consultationType)) {
      throw new ValidationError("Loại tư vấn không hợp lệ");
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ValidationError("Email không hợp lệ");
    }

    return Consultation.create({
      ...data,
      status: "pending",
    });
  }

  async deleteWithFeedback(id: string, feedbackData: IDeleteConsultationInput) {
    // Send feedback email
    const mailContent = sendMailConsultationFeedback(
      feedbackData.name,
      feedbackData.email,
      feedbackData.feedback
    );
    await sendEmail(feedbackData.email, "Phản hồi từ Tín Chỉ Carbon Việt Nam", mailContent);

    // Delete consultation
    const deleted = await Consultation.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy bản ghi để xóa");
    }

    return deleted;
  }
}

export default new ConsultationService();
