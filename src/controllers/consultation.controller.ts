import type { Request, Response } from "express";
import Consultation from "../models/consultation";
import type { IConsultation } from "../types/consultation";
import {
  sendMailConsultationFeedback,
  sendMailRegisterCheckout,
} from "../utils/email/emailTemplates";
import { sendEmail } from "../utils/email/sendEmail";

interface ConsultationRequest extends Request {
  body: { formData: IConsultation }; // Thêm formData vào trong body
}

type OmitConsultation = Omit<IConsultation, "createdAt" | "updatedAt" | "_id">;

export const registerConsultation = async (
  req: ConsultationRequest,
  res: Response,
): Promise<void> => {
  console.log("Chạy vào đây");

  try {
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

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Vui lòng đăng nhập trước khi gửi tư vấn",
      });
      return;
    }

    if (!name || !phone || !email || !consultationType) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: name, phone, email, consultationType",
      });
      return;
    }
    const validTypes = [
      "forest",
      "agriculture",
      "biochar",
      "csu",
      "carbonbook",
      "other",
    ];
    if (!validTypes.includes(consultationType)) {
      res.status(400).json({
        success: false,
        error: "Invalid consultationType",
      });
      return;
    }

    // Kiểm tra email hợp lệ
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
      return;
    }

    // Dữ liệu để lưu vào database
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

    const consultation = new Consultation(consultationData);
    await consultation.save();

    res.status(200).json({
      success: true,
      message: "Consultation registered successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Error registering consultation:", error);
    res.status(500).json({
      success: false,
      error: "Server error, please try again later",
    });
  }
};
export const getAllConsultation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultations = await Consultation.find();
    res.status(200).json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error("Error getting consultations:", error);
    res.status(500).json({
      success: false,
      error: "Server error, please try again later",
    });
  }
};
export const deleteConsultation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const _id = req.params.id;

    const { email, feedback, name } = req.body;
    const mailContent = sendMailConsultationFeedback(name, email, feedback);

    await sendEmail(email, "Phản hồi từ Tín Chỉ Carbon Việt Nam", mailContent);
    const deleted = await Consultation.findByIdAndDelete(_id);
    if (!deleted) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bản ghi để xoá." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Phản hồi đã gửi, consultation đã được xoá.",
      deleted,
    });
  } catch (error) {
    console.error("Error in deleteConsultation:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};
