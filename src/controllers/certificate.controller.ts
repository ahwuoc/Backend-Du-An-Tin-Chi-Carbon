import type { Request, Response } from "express";
import { Certificate } from "../models/certificate.model";

export class CertificateController {
  static async getAll(req: Request, res: Response) {
    try {
      const certificates = await Certificate.find();
      res.json(certificates);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách chứng chỉ", error });
    }
  }

  static async getById(req: Request, res: Response) {
    const _id = req.params.id;
    try {
      const cert = await Certificate.findOne({ _id });
      if (!cert) res.status(404).json({ message: "Không tìm thấy chứng chỉ" });
      res.json(cert);
      return;
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tìm chứng chỉ", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const cert = new Certificate(req.body);
      await cert.save();
      res.status(201).json(cert);
    } catch (error) {
      res.status(400).json({ message: "Tạo chứng chỉ thất bại", error });
    }
  }

  static async update(req: Request, res: Response) {
    const _id = req.params.id;
    try {
      const updated = await Certificate.findOneAndUpdate({ _id }, req.body, {
        new: true,
      });
      if (!updated) {
        res
          .status(404)
          .json({ message: "Không tìm thấy chứng chỉ để cập nhật" });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Cập nhật thất bại", error });
    }
  }

  static async delete(req: Request, res: Response) {
    const _id = req.params.id;
    try {
      const deleted = await Certificate.findOneAndDelete({ _id });
      if (!deleted)
        res.status(404).json({ message: "Không tìm thấy chứng chỉ để xoá" });
      res.json({ message: "Xoá thành công", deleted });
      return;
    } catch (error) {
      res.status(500).json({ message: "Xoá thất bại", error });
    }
  }
}
