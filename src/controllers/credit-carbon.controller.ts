import type { Request, Response } from "express";
import CarbonCredit from "../models/carboncredit.model";

export class CarbonCreditController {
  // GET all
  static async getAll(req: Request, res: Response) {
    try {
      const data = await CarbonCredit.find();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
    }
  }

  // GET by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await CarbonCredit.findById(id);
      if (!data) {
        res.status(404).json({ error: "Không tìm thấy tài nguyên" });
        return;
      }
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
    }
  }

  // CREATE
  static async create(req: Request, res: Response) {
    try {
      const newItem = new CarbonCredit(req.body);
      const saved = await newItem.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: "Dữ liệu không hợp lệ hoặc thiếu" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await CarbonCredit.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updated) {
        res.status(404).json({ error: "Không tìm thấy tài nguyên" });
        return;
      }

      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: "Dữ liệu không hợp lệ hoặc thiếu" });
    }
  }

  // DELETE by ID
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CarbonCredit.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ error: "Không tìm thấy tài nguyên" });
        return;
      }
      res.status(200).json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ error: "Lỗi server khi xóa dữ liệu" });
    }
  }
}
