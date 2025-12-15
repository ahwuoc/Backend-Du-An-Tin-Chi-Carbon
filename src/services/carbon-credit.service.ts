import CarbonCredit from "../models/carboncredit.model";
import { NotFoundError } from "../utils";

export interface ICreateCarbonCreditInput {
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  status?: "available" | "sold" | "reserved";
  projectId?: string;
  certificateId?: string;
}

class CarbonCreditService {
  async getAll() {
    return CarbonCredit.find().lean();
  }

  async getById(id: string) {
    const data = await CarbonCredit.findById(id).lean();
    if (!data) {
      throw new NotFoundError("Không tìm thấy carbon credit");
    }
    return data;
  }

  async create(data: ICreateCarbonCreditInput) {
    return CarbonCredit.create(data);
  }

  async update(id: string, data: Partial<ICreateCarbonCreditInput>) {
    const updated = await CarbonCredit.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      throw new NotFoundError("Không tìm thấy carbon credit");
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await CarbonCredit.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy carbon credit");
    }
    return deleted;
  }
}

export default new CarbonCreditService();
