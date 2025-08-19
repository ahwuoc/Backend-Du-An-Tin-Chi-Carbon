import type { Request, Response } from "express";
import AffiliateTransaction from "../models/affiliate-transaction.model";
import type { IAffiliateTransaction } from "../types/affiliate-transaction";
export class AffiliateTransactionController {
  static async getAll(req: Request, res: Response) {
    try {
      const transactions = await AffiliateTransaction.find().lean();
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error getting transactions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET by ID
  static async getById(req: Request, res: Response) {
    try {
      const affiliateId = req.params.id;
      const affiliate = await AffiliateTransaction.findOne({
        affiliateId,
      }).lean();
      if (!affiliate) {
        res.status(404).json({ message: "Affiliate not found" });
        return;
      }
      res.status(200).json(affiliate);
    } catch (error) {
      console.error("Error getting transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST create
  static async create(req: Request, res: Response) {
    try {
      const data = req.body as Partial<IAffiliateTransaction>;
      const newTransaction = new AffiliateTransaction(data);
      await newTransaction.save();
      res.status(201).json(newTransaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: "Invalid data", error });
    }
  }

  // PUT update
  static async update(req: Request, res: Response) {
    try {
      const updated = await AffiliateTransaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).lean();
      if (!updated) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }
      res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(400).json({ message: "Invalid update data", error });
    }
  }

  // DELETE
  static async delete(req: Request, res: Response) {
    try {
      const deleted = await AffiliateTransaction.findByIdAndDelete(
        req.params.id
      ).lean();
      if (!deleted) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
