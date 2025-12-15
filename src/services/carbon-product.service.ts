import { CarbonProduct } from "../models/carbonproduct";
import { NotFoundError } from "../utils";

export interface ICreateCarbonProductInput {
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  status?: "active" | "inactive" | "sold_out";
  type?: string;
  category?: string;
  images?: string[];
}

class CarbonProductService {
  async getAll() {
    return CarbonProduct.find().lean();
  }

  async getById(id: string) {
    const product = await CarbonProduct.findById(id).lean();
    if (!product) {
      throw new NotFoundError("Không tìm thấy sản phẩm");
    }
    return product;
  }

  async create(data: ICreateCarbonProductInput) {
    return CarbonProduct.create(data);
  }

  async update(id: string, data: Partial<ICreateCarbonProductInput>) {
    const updatedProduct = await CarbonProduct.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedProduct) {
      throw new NotFoundError("Không tìm thấy sản phẩm để cập nhật");
    }

    return updatedProduct;
  }

  async delete(id: string) {
    const deletedProduct = await CarbonProduct.findByIdAndDelete(id).lean();
    if (!deletedProduct) {
      throw new NotFoundError("Không tìm thấy sản phẩm để xóa");
    }
    return deletedProduct;
  }
}

export default new CarbonProductService();
