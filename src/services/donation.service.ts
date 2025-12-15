import Donation from "../models/donate.model";
import { createPayOs, IData, IPayOs } from "../utils/payment";
import { NotFoundError, BadRequestError } from "../utils";

export interface ICreateDonationInput {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  note?: string;
}

class DonationService {
  async create(data: ICreateDonationInput, baseUrl: string) {
    // Create PayOS payment
    const random6Digits = Math.floor(100000 + Math.random() * 900000);
    const payosPayload: IPayOs = {
      orderCode: random6Digits,
      amount: data.quantity * 55000,
      description: data.note || "",
      cancelUrl: `${baseUrl}/gop-mam-xanh#plant-tree-section`,
      returnUrl: `${baseUrl}/gop-mam-xanh#plant-tree-section`,
    };

    const dataPayload: IData = {
      buyerName: data.name,
      buyerEmail: data.email,
      buyerPhone: data.phone,
    };

    const response = await createPayOs(payosPayload, dataPayload);

    if (response.code === "00") {
      const donation = await Donation.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        quantity: data.quantity,
        orderCode: response.data.orderCode,
        note: response.data.description,
        totalAmount: response.data.amount,
        expiredAt: response.data.expiredAt,
        checkoutUrl: response.data.checkoutUrl,
        success: "success",
      });

      return { donation, checkoutUrl: response.data.checkoutUrl };
    }

    throw new BadRequestError("Không thể tạo thanh toán");
  }

  async getAll() {
    return Donation.find().sort({ createdAt: -1 }).limit(50).lean();
  }

  async getInfo() {
    const donations = await Donation.find().sort({ createdAt: -1 }).limit(50).lean();

    const totalQuantity = donations.reduce((acc, d) => acc + d.quantity, 0);
    const totalTreeCount = donations.reduce((acc, d) => acc + (d.quantity || 0), 0);

    const contributorMap: Record<string, number> = {};
    donations.forEach((d) => {
      const key = d.email || d.userId?.toString() || "unknown";
      contributorMap[key] = (contributorMap[key] || 0) + (d.quantity || 0);
    });

    const treeCountByUser = Object.entries(contributorMap).map(([email, treeCount]) => ({
      email,
      treeCount,
    }));

    return {
      donations,
      totalQuantity,
      totalTreeCount,
      contributorCount: Object.keys(contributorMap).length,
      treeCountByUser,
    };
  }

  async getById(id: string) {
    const donation = await Donation.findById(id).lean();
    if (!donation) {
      throw new NotFoundError("Không tìm thấy donation");
    }
    return donation;
  }

  async updateStatus(orderCode: string) {
    const donation = await Donation.findOneAndUpdate(
      { orderCode },
      { $set: { status: "success" } },
      { new: true }
    );

    if (!donation) {
      throw new NotFoundError("Không tìm thấy đơn đóng góp với mã đơn này");
    }

    return donation;
  }

  async update(id: string, data: Partial<ICreateDonationInput>) {
    const updated = await Donation.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundError("Không tìm thấy donation để cập nhật");
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await Donation.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy donation cần xóa");
    }
    return deleted;
  }
}

export default new DonationService();
