import { Types } from "mongoose";
import Affiliate from "../models/affiliate.model";
import type { Request, Response } from "express";
import { UserModel } from "../models/users.model";
import { sendEmail } from "../utils/sendEmail";
import { templateAfifliate } from "../utils/emailTemplates";
import AffiliatePaymentMethod from "../models/affiliate-paymethod.model";
class AffiliateController {
  async createAffiliate(req: Request, res: Response) {
    try {
      const {
        userId,
        fullName,
        email,
        phone,
        company,
        reason,
        address,
        website,
        socialMedia,
        experience,
      } = req.body;
      console.log(req.body);

      // Kiểm tra các trường bắt buộc
      if (!userId || !fullName || !email || !phone) {
        res.status(400).json({
          message: "Missing required fields: userId, fullName, email, phone",
        });
      }
      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        res.status(400).json({ message: "User not found" });
      }
      const existingAffiliate = await Affiliate.findOne({ userId });
      if (existingAffiliate) {
        res.status(400).json({
          message: "User is already registered as an affiliate",
        });
      }

      // Tạo referral link không cần code
      const referralLink = `${
        process.env.FRONT_END_URL || "http://localhost:3000/"
      }/dang-ky?ref=${userId}`;

      // Tạo bản ghi affiliate
      const affiliate = new Affiliate({
        userId,
        fullName,
        email,
        phone,
        company,
        reason,
        address,
        website,
        socialMedia,
        experience,
        referralLink,
        totalClicks: 0,
        totalRegistrations: 0,
        totalCommission: 0,
        status: "pending",
      });

      await affiliate.save();
      const emailContent = templateAfifliate({
        name: fullName,
        email,
        referralLink,
      });
      await sendEmail(email, "Đăng ký affiliate thành công", emailContent);
      res.status(201).json({
        message: "Affiliate registration submitted. Waiting for approval.",
        affiliate: {
          _id: affiliate._id,
          userId: affiliate.userId,
          fullName: affiliate.fullName,
          email: affiliate.email,
          status: affiliate.status,
        },
      });
    } catch (error) {
      console.error("Error creating affiliate:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAllAffiliates(req: Request, res: Response) {
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method Not Allowed" });
      return;
    }
    try {
      const affiliates = await Affiliate.find()
        .populate("userId", "username email")
        .lean();

      res.status(200).json({
        message: "Affiliates retrieved successfully",
        affiliates,
      });
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getAffiliateByUserId(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const affiliate = await Affiliate.findOne({ userId }).populate("userId");
      if (!affiliate) {
        res.status(404).json({ message: "Affiliate not found" });
        return;
      }

      const paymethod = await AffiliatePaymentMethod.findOne({
        affiliateId: affiliate._id,
      }).lean();

      if (!paymethod) {
        res.status(200).json({
          message: "Affiliate found, but no payment method available",
          affiliate,
          paymethod: null,
        });
        return;
      }
      res.status(200).json({
        message: "Affiliate and payment method retrieved successfully",
        affiliate,
        paymethod,
      });
      return;
    } catch (error) {
      console.error("Error fetching affiliate:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateAffiliate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fullName, email, phone, reason, referralCode, status } = req.body;
      if (
        !fullName ||
        !email ||
        !phone ||
        !reason ||
        !referralCode ||
        !status
      ) {
        res.status(400).json({ message: "Missing required fields" });
      }
      const affiliate = await Affiliate.findByIdAndUpdate(
        id,
        { fullName, email, phone, reason, referralCode, status },
        { new: true, runValidators: true }
      );
      if (!affiliate) {
        res.status(404).json({ message: "Affiliate not found" });
      }
      res
        .status(200)
        .json({ message: "Affiliate updated successfully", affiliate });
    } catch (error) {
      console.error(
        `[updateAffiliate] Error: ${
          error instanceof Error ? error.message : error
        }`
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async deleteAffiliate(req: Request, res: Response) {
    if (req.method !== "DELETE") {
      res.status(405).json({ message: "Method Not Allowed" });
      return;
    }

    try {
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid affiliate ID" });
        return;
      }

      const affiliate = await Affiliate.findByIdAndDelete(id);

      if (!affiliate) {
        res.status(404).json({ message: "Affiliate not found" });
        return;
      }

      res.status(200).json({
        message: "Affiliate deleted successfully",
        affiliateId: id,
      });
    } catch (error) {
      console.error("Error deleting affiliate:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export const affiliateController = new AffiliateController();
