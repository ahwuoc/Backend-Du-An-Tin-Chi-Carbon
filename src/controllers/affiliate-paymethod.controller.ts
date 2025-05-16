import type { Request, Response } from "express";
import mongoose from "mongoose";
import AffiliatePaymentMethod, {
  type IAffiliatePaymentMethod,
} from "../models/affiliate-paymethod.model";
import { type IPaymentMethod } from "../models/paymethod.model";
import Affiliate from "../models/affiliate.model";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export default class AffiliatePaymentMethodController {
  static async getAffiliatePaymentMethods(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const affiliate = await Affiliate.findOne({ userId });
      if (!affiliate) {
        res.status(404).json({ message: "Affiliate not found" });
        return;
      }
      const paymentMethods = await AffiliatePaymentMethod.find({
        affiliateId: affiliate._id,
      }).sort({ isDefault: -1, createdAt: -1 });
      res.status(200).json(paymentMethods);
      return;
    } catch (err) {
      console.error("[AffiliatePaymentMethod] Fetch error:", err);

      res.status(500).json({
        message: "Failed to fetch affiliate payment methods",
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }
  }
  static async getAffiliatePaymentMethodById(req: Request, res: Response) {
    try {
      const { methodId } = req.params;

      if (!methodId) {
        res.status(400).json({ message: "Invalid Affiliate or Method ID" });
        return;
      }
      if (!isValidObjectId(methodId)) {
        res.status(400).json({ message: "Invalid Affiliate or Method ID" });
        return;
      }

      const paymentMethod: IPaymentMethod | null =
        await AffiliatePaymentMethod.findOne({
          _id: methodId,
        });

      if (!paymentMethod) {
        res.status(404).json({ message: "Affiliate payment method not found" });
        return;
      }

      res.status(200).json(paymentMethod);
      return;
    } catch (error: any) {
      if (error.kind === "ObjectId") {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }
      console.error("Error fetching affiliate payment method by ID:", error);
      res.status(500).json({
        message: "Error fetching affiliate payment method",
        error: error.message,
      });
      return;
    }
  }

  static async createAffiliatePaymentMethod(req: Request, res: Response) {
    try {
      const { userId, type, name, details, isDefault = false } = req.body;

      if (!isValidObjectId(userId)) {
        res.status(400).json({ message: "Invalid Affiliate ID" });
      }

      const affiliate = await Affiliate.findOne({ userId });
      if (!affiliate) {
        res.status(404).json({ message: "Affiliate not found" });
        return;
      }

      if (!type || !details) {
        res.status(400).json({ message: "Type and details are required" });
      }
      const newPaymentMethod = await AffiliatePaymentMethod.create({
        affiliateId: affiliate._id,
        type,
        name,
        details,
        isDefault,
      });
      res.status(201).json(newPaymentMethod);
    } catch (error: any) {
      console.error("Error creating affiliate payment method:", error);
      if (error.name === "ValidationError") {
        res.status(400).json({
          message: "Validation Error",
          errors: error.errors,
        });
      }

      if (error.kind === "ObjectId") {
        res.status(400).json({ message: "Invalid Affiliate ID format" });
      }

      res.status(500).json({
        message: "Server error while creating affiliate payment method",
        error: error.message,
      });
    }
  }

  static async updateAffiliatePaymentMethod(req: Request, res: Response) {
    try {
      const { methodId } = req.params;
      const updateData = req.body;
      if (!methodId) {
        res.status(400).json({ message: "Invalid Affiliate or Method ID" });
        return;
      }
      if (!isValidObjectId(methodId)) {
        res.status(400).json({ message: "Invalid Affiliate or Method ID" });
        return;
      }

      const affiliate = await Affiliate.findById(methodId);
      if (!affiliate) {
        res.status(404).json({ message: "Affiliate not found" });
        return;
      }

      let paymentMethod: IPaymentMethod | null =
        await AffiliatePaymentMethod.findOne({
          _id: methodId,
        });

      if (!paymentMethod) {
        res.status(404).json({ message: "Affiliate payment method not found" });
        return;
      }

      if (updateData.isDefault === true && !paymentMethod.isDefault) {
        await AffiliatePaymentMethod.updateMany(
          { methodId, isDefault: true },
          { isDefault: false }
        );
      }

      const allowedUpdates = ["type", "name", "details", "isDefault"];
      Object.keys(updateData).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          if (key === "details" && typeof updateData.details === "object") {
            paymentMethod.details = {
              ...paymentMethod.details,
              ...updateData.details,
            };
          } else {
            (paymentMethod as any)[key] = updateData[key];
          }
        }
      });

      await paymentMethod.save();

      res.status(200).json(paymentMethod);
      return;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        res
          .status(400)
          .json({ message: "Validation Error", errors: error.errors });
        return;
      }
      if (error.kind === "ObjectId") {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }
      console.error("Error updating affiliate payment method:", error);
      res.status(500).json({
        message: "Error updating affiliate payment method",
        error: error.message,
      });
      return;
    }
  }

  static async deleteAffiliatePaymentMethod(req: Request, res: Response) {
    try {
      const { methodId } = req.params;

      if (!methodId) {
        res.status(400).json({ message: "Invalid method ID" });
        return;
      }
      if (!isValidObjectId(methodId)) {
        res.status(400).json({ message: "Invalid method ID" });
        return;
      }

      const deleted = await AffiliatePaymentMethod.findByIdAndDelete(methodId);

      if (!deleted) {
        res.status(404).json({ message: "Payment method not found" });
        return;
      }
      if (deleted.isDefault) {
        await AffiliatePaymentMethod.findOneAndUpdate(
          {},
          { isDefault: true },
          { sort: { createdAt: -1 } }
        );
      }
      res.status(200).json({ message: "Payment method deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({
        message: "Failed to delete payment method",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
