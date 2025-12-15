import AffiliatePaymentMethod from "../models/affiliate-paymethod.model";
import Affiliate from "../models/affiliate.model";
import { NotFoundError, BadRequestError } from "../utils";

export interface ICreatePaymentMethodInput {
  userId: string;
  type: "bank" | "momo" | "zalopay" | "paypal";
  name?: string;
  details: Record<string, any>;
  isDefault?: boolean;
}

class AffiliatePaymentMethodService {
  async getByUserId(userId: string) {
    const affiliate = await Affiliate.findOne({ userId });
    if (!affiliate) {
      throw new NotFoundError("Không tìm thấy affiliate");
    }

    return AffiliatePaymentMethod.find({
      affiliateId: affiliate._id,
    }).sort({ isDefault: -1, createdAt: -1 });
  }

  async getById(methodId: string) {
    const paymentMethod = await AffiliatePaymentMethod.findById(methodId);
    if (!paymentMethod) {
      throw new NotFoundError("Không tìm thấy phương thức thanh toán");
    }
    return paymentMethod;
  }

  async create(data: ICreatePaymentMethodInput) {
    const affiliate = await Affiliate.findOne({ userId: data.userId });
    if (!affiliate) {
      throw new NotFoundError("Không tìm thấy affiliate");
    }

    return AffiliatePaymentMethod.create({
      affiliateId: affiliate._id,
      type: data.type,
      name: data.name,
      details: data.details,
      isDefault: data.isDefault || false,
    });
  }

  async update(methodId: string, data: Partial<ICreatePaymentMethodInput>) {
    const paymentMethod = await AffiliatePaymentMethod.findById(methodId);
    if (!paymentMethod) {
      throw new NotFoundError("Không tìm thấy phương thức thanh toán");
    }

    // If setting as default, unset other defaults
    if (data.isDefault === true && !paymentMethod.isDefault) {
      await AffiliatePaymentMethod.updateMany(
        { affiliateId: paymentMethod.affiliateId, isDefault: true },
        { isDefault: false }
      );
    }

    // Update allowed fields
    const allowedUpdates = ["type", "name", "details", "isDefault"];
    allowedUpdates.forEach((key) => {
      if ((data as any)[key] !== undefined) {
        if (key === "details" && typeof data.details === "object") {
          paymentMethod.details = { ...paymentMethod.details, ...data.details };
        } else {
          (paymentMethod as any)[key] = (data as any)[key];
        }
      }
    });

    await paymentMethod.save();
    return paymentMethod;
  }

  async delete(methodId: string) {
    const deleted = await AffiliatePaymentMethod.findByIdAndDelete(methodId);
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy phương thức thanh toán");
    }

    // If deleted was default, set another as default
    if (deleted.isDefault) {
      await AffiliatePaymentMethod.findOneAndUpdate(
        { affiliateId: deleted.affiliateId },
        { isDefault: true },
        { sort: { createdAt: -1 } }
      );
    }

    return deleted;
  }
}

export default new AffiliatePaymentMethodService();
