import type { Request, Response } from "express";
import Donation from "../models/donate.model";

class DonationController {
  public async createDonation(req: Request, res: Response) {
    console.log("Chạy vào createDonation");

    try {
      const { name, email, phone, quantity, note, totalAmount, bankInfo } =
        req.body;
      if (
        !name ||
        !email ||
        !phone ||
        !quantity ||
        !totalAmount ||
        !bankInfo?.accountName ||
        !bankInfo?.accountNumber ||
        !bankInfo?.bank ||
        !bankInfo?.branch ||
        !bankInfo?.content
      ) {
        res
          .status(400)
          .json({ error: "Thiếu thông tin bắt buộc, kiểm tra lại nào!" });
      }
      const donation = new Donation({
        name,
        email,
        phone,
        quantity,
        note,
        totalAmount,
        bankInfo,
        treeCount: req.body.treeCount || 0,
        amount: req.body.amount || 0,
        user: req.body.user || null,
      });

      await donation.save();
      res.status(201).json({
        message: "Đóng góp thành công, cảm ơn bạn đã góp xanh! 🌳",
        donation,
      });
    } catch (error) {
      console.error("Lỗi khi lưu đóng góp:", error);
      res
        .status(500)
        .json({ error: "Oops! Server hỏng mất, thử lại sau nhé!" });
    }
  }
  public async getInfoDonations(req: Request, res: Response) {
    try {
      const donations = await Donation.find().sort({ createdAt: -1 }).limit(50);

      const totalQuantity = donations.reduce(
        (acc, donation) => acc + donation.quantity,
        0,
      );

      const totalTreeCount = donations.reduce(
        (acc, donation) => acc + (donation.treeCount || 0),
        0,
      );

      const contributorMap: Record<string, number> = {};

      donations.forEach((d) => {
        const key = d.email || d.user || "unknown";
        if (!contributorMap[key]) {
          contributorMap[key] = 0;
        }
        contributorMap[key] += d.treeCount || 0;
      });

      const treeCountByUser = Object.entries(contributorMap).map(
        ([email, treeCount]) => ({
          email,
          treeCount,
        }),
      );

      res.status(200).json({
        donations,
        totalQuantity,
        totalTreeCount,
        contributorCount: Object.keys(contributorMap).length,
        treeCountByUser, // 🆕 thêm phần này
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đóng góp:", error);
      res
        .status(500)
        .json({ error: "Lỗi server, danh sách đóng góp mất tiêu rồi!" });
    }
  }

  public async getDonations(req: Request, res: Response) {
    try {
      const donations = await Donation.find().sort({ createdAt: -1 }).limit(50);
      res.status(200).json({ donations });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đóng góp:", error);
      res
        .status(500)
        .json({ error: "Lỗi server, danh sách đóng góp mất tiêu rồi!" });
    }
  }

  public async deleteDonations(req: Request, res: Response) {
    const _id = req.params.id;
    try {
      const deleted = await Donation.findByIdAndDelete(_id);

      if (!deleted) {
        res.status(404).json({ error: "Không tìm thấy donation cần xóa." });
        return;
      }
      res.status(200).json({ message: "Xóa donation thành công!", deleted });
    } catch (error) {
      console.error("Lỗi khi xóa donation:", error);
      res.status(500).json({ error: "Lỗi server, xóa không được rồi!" });
    }
  }
  public async updateDonations(req: Request, res: Response) {
    const _id = req.params.id;
    const updateData = req.body;
    try {
      const updated = await Donation.findByIdAndUpdate(_id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        res.status(404).json({ error: "Không tìm thấy donation để cập nhật." });
        return;
      }
      res
        .status(200)
        .json({ message: "Cập nhật donation thành công!", updated });
    } catch (error) {
      console.error("Lỗi khi cập nhật donation:", error);
      res.status(500).json({ error: "Lỗi server, cập nhật thất bại!" });
    }
  }
}

export default DonationController;
