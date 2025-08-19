import { Types } from "mongoose";
import { Product, type IProduct } from "../models/products.model";

export interface IProductQuery {
  type?: string;
  status?: string;
  search?: string;
  price?: string;
  priceMin?: string;
  priceMax?: string;
}

export interface IProductService {
  getFreeTrialProduct(): Promise<IProduct | null>;
  getAllProducts(): Promise<IProduct[]>;
  getProducts(query: IProductQuery): Promise<IProduct[]>;
  getProductById(id: string): Promise<IProduct | null>;
  createProduct(productData: IProduct): Promise<IProduct>;
  updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
  validateProductData(productData: IProduct): string[];
}

export class ProductService implements IProductService {
  public async getFreeTrialProduct(): Promise<IProduct | null> {
    return await Product.findOne({ price: 0 });
  }

  public async getAllProducts(): Promise<IProduct[]> {
    return await Product.find();
  }

  public async getProducts(query: IProductQuery): Promise<IProduct[]> {
    const queryObj: any = {};

    if (query.type) queryObj.type = query.type;
    if (query.status) queryObj.status = query.status;

    if (query.search) {
      queryObj.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.price) {
      const parsedPrice = parseFloat(query.price);
      if (!isNaN(parsedPrice)) {
        queryObj.price = { $lt: parsedPrice };
      }
    }

    if (query.priceMin || query.priceMax) {
      queryObj.price = queryObj.price || {};

      if (query.priceMin) {
        const parsedPriceMin = parseFloat(query.priceMin);
        if (!isNaN(parsedPriceMin)) {
          queryObj.price.$gte = parsedPriceMin;
        }
      }

      if (query.priceMax) {
        const parsedPriceMax = parseFloat(query.priceMax);
        if (!isNaN(parsedPriceMax)) {
          queryObj.price.$lte = parsedPriceMax;
        }
      }
    }

    return await Product.find(queryObj);
  }

  public async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findOne({ _id: id });
  }

  public async createProduct(productData: IProduct): Promise<IProduct> {
    return await Product.create(productData);
  }

  public async updateProduct(
    id: string,
    updateData: Partial<IProduct>,
  ): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  public validateProductData(productData: IProduct): string[] {
    const errors: string[] = [];

    if (!productData.name) {
      errors.push("Tên sản phẩm là bắt buộc");
    }

    if (!productData.type) {
      errors.push("Loại sản phẩm là bắt buộc");
    }

    if (!productData.description) {
      errors.push("Mô tả sản phẩm là bắt buộc");
    }

    if (!productData.status) {
      errors.push("Trạng thái sản phẩm là bắt buộc");
    }

    if (productData.price !== undefined && productData.price < 0) {
      errors.push("Giá sản phẩm không được âm");
    }

    return errors;
  }
}

export default new ProductService();
