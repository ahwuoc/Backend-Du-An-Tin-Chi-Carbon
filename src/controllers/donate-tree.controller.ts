import type { Request, Response } from "express";
import Donation from "../models/donate.model";
import { validateFlow } from "../fsm/base-fsm";
import { DonationForm } from "../validate/donation.form";
import { createPayOs, IData, IPayOs } from "../utils/payment";

class DonationController {
  public static async createDonation(req: Request, res: Response) {
    const { name, email, phone, quantity, note } = req.body;
    const errors = await validateFlow(req.body, DonationForm);
    if (errors.length > 0) {
      res.status(400).json({
        message: "Thiếu thông tin bắt buộc",
        errors,
      });
      return;
    }
    try {
      // ===========Handler PaysOS =========
      // Payload gửi tới payos
      let baseUrl =
        req.headers.referer?.toString() ||
        req.headers.origin?.toString() ||
        process.env.FRONT_END_URL;
      if (!baseUrl) {
        throw new Error("❌ Không xác định được baseUrl");
      }
      baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      const random6Digits = Math.floor(100000 + Math.random() * 900000);
      const payosPayload: IPayOs = {
        orderCode: random6Digits,
        amount: quantity * 55000,
        description: note,
        cancelUrl: `${baseUrl}/gop-mam-xanh#plant-tree-section`,
        returnUrl: `${baseUrl}/gop-mam-xanh#plant-tree-section`,
      };
      const dataPayload: IData = {
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
      };
      // ===========Mock BaseUrl======
      const response = await createPayOs(payosPayload, dataPayload);
      if (response.code == "00") {
        const donation = new Donation({
          name,
          email,
          phone,
          quantity,
          orderCode: response.data.orderCode,
          note: response.data.description,
          totalAmount: response.data.amount,
          expiredAt: response.data.expiredAt,
          checkoutUrl: response.data.checkoutUrl,
          success: "success",
        });
        await donation.save();
        res.status(201).json({
          message: "Đóng góp thành công, cảm ơn bạn đã góp xanh! 🌳",
          checkoutUrl: response.data.checkoutUrl,
        });
      }
    } catch (error) {
      console.log("Lỗi", error);
      res
        .status(500)
        .json({ error: "Oops! Server hỏng mất, thử lại sau nhé!" });
      return;
    }
  }
  public static async getInfoDonations(req: Request, res: Response) {
    try {
      const donations = await Donation.find().sort({ createdAt: -1 }).limit(50);

      const totalQuantity = donations.reduce(
        (acc, donation) => acc + donation.quantity,
        0,
      );

      const totalTreeCount = donations.reduce(
        (acc, donation) => acc + (donation.quantity || 0),
        0,
      );

      const contributorMap: Record<string, number> = {};

      donations.forEach((d) => {
        const key = d.email || d.userId?.toString() || "unknown";
        if (!contributorMap[key]) {
          contributorMap[key] = 0;
        }
        contributorMap[key] += d.quantity || 0;
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
        treeCountByUser,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đóng góp:", error);
      res
        .status(500)
        .json({ error: "Lỗi server, danh sách đóng góp mất tiêu rồi!" });
    }
  }

  public static async getDonations(req: Request, res: Response) {
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

  public static async deleteDonations(req: Request, res: Response) {
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
  public static async getDonationAndUpdateStatus(req: Request, res: Response) {
    const orderCode = req.params.id;
    try {
      const donationTree = await Donation.findOneAndUpdate(
        { orderCode },
        { $set: { status: "success" } }, // 👈 update giá trị status
        { new: true },
      );

      if (!donationTree) {
        res.status(404).json({
          message: "Không tìm thấy đơn đóng góp với mã đơn này.",
        });
        return;
      }
      res.status(200).json({
        message: "Cập nhật trạng thái thành công.",
        donation: donationTree,
      });
      return;
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn donation:", err);
      res.status(500).json({
        message: "Lỗi server khi xử lý đơn donation.",
      });
      return;
    }
  }
  public static async updateDonations(req: Request, res: Response) {
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
