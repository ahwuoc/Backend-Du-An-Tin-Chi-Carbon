import { Certificate } from "../models/certificate.model";
import { NotFoundError } from "../utils";

export interface ICreateCertificateInput {
  name: string;
  description?: string;
  issuer?: string;
  issueDate?: Date;
  expiryDate?: Date;
  certificateNumber?: string;
  imageUrl?: string;
  carbonCredits?: number;
}

class CertificateService {
  async getAll() {
    return Certificate.find().lean();
  }

  async getById(id: string) {
    const cert = await Certificate.findById(id).lean();
    if (!cert) {
      throw new NotFoundError("Không tìm thấy chứng chỉ");
    }
    return cert;
  }

  async create(data: ICreateCertificateInput) {
    return Certificate.create(data);
  }

  async update(id: string, data: Partial<ICreateCertificateInput>) {
    const updated = await Certificate.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      throw new NotFoundError("Không tìm thấy chứng chỉ để cập nhật");
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await Certificate.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy chứng chỉ để xóa");
    }
    return deleted;
  }
}

export default new CertificateService();
