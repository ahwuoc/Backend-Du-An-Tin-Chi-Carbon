import Affiliate from "../models/affiliate.model";
import { UserModel } from "../models/users.model";
import AffiliatePaymentMethod from "../models/affiliate-paymethod.model";
import { sendEmail } from "../utils/email/sendEmail";
import { templateAfifliate } from "../utils/email/emailTemplates";
import { config } from "../config/env";
import { ConflictError, NotFoundError } from "../utils";

export interface ICreateAffiliateInput {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  reason?: string;
  address?: string;
  website?: string;
  socialMedia?: string;
  experience?: string;
}

class AffiliateService {
  async create(data: ICreateAffiliateInput) {
    // Check user exists
    const existingUser = await UserModel.findById(data.userId);
    if (!existingUser) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    // Check if already affiliate
    const existingAffiliate = await Affiliate.findOne({ userId: data.userId });
    if (existingAffiliate) {
      throw new ConflictError("Người dùng đã đăng ký affiliate");
    }

    // Create referral link
    const referralLink = `${config.FRONTEND_URL}/dang-ky?ref=${data.userId}`;

    // Create affiliate
    const affiliate = await Affiliate.create({
      ...data,
      referralLink,
      totalClicks: 0,
      totalRegistrations: 0,
      totalCommission: 0,
      status: "pending",
    });

    // Send email
    const emailContent = templateAfifliate({
      name: data.fullName,
      email: data.email,
      referralLink,
    });
    await sendEmail(data.email, "Đăng ký affiliate thành công", emailContent);

    return affiliate;
  }

  async getAll() {
    return Affiliate.find().populate("userId", "username email").lean();
  }

  async getByUserId(userId: string) {
    const affiliate = await Affiliate.findOne({ userId }).populate("userId");
    if (!affiliate) {
      throw new NotFoundError("Không tìm thấy affiliate");
    }

    const paymethod = await AffiliatePaymentMethod.findOne({
      affiliateId: affiliate._id,
    }).lean();

    return { affiliate, paymethod: paymethod || null };
  }

  async updateStatus(id: string, status: string) {
    const affiliate = await Affiliate.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!affiliate) {
      throw new NotFoundError("Không tìm thấy affiliate");
    }

    return affiliate;
  }

  async delete(id: string) {
    const affiliate = await Affiliate.findByIdAndDelete(id);
    if (!affiliate) {
      throw new NotFoundError("Không tìm thấy affiliate");
    }
    return affiliate;
  }
}

export default new AffiliateService();
