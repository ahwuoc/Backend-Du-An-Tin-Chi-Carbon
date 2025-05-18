import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Product, type IProduct } from "../models/products.model";

class ProductController {
  public async getFreeTrialProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await Product.findOne({ price: 0 });
      if (!product) {
        res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm free trial!" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }
  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { type, status, search, price, priceMin, priceMax } = req.query;
      const query: any = {};

      if (type) query.type = type;
      if (status) query.status = status;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      if (price) {
        const parsedPrice = parseFloat(price as string);
        if (!isNaN(parsedPrice)) {
          query.price = { $lt: parsedPrice }; // Giá nhỏ hơn
        }
      }
      if (priceMin || priceMax) {
        query.price = query.price || {}; // Tạo đối tượng price nếu chưa có

        if (priceMin) {
          const parsedPriceMin = parseFloat(priceMin as string);
          if (!isNaN(parsedPriceMin)) {
            query.price.$gte = parsedPriceMin;
          }
        }
        if (priceMax) {
          const parsedPriceMax = parseFloat(priceMax as string);
          if (!isNaN(parsedPriceMax)) {
            query.price.$lte = parsedPriceMax; // Giá nhỏ hơn hoặc bằng priceMax
          }
        }
      }

      const products = await Product.find(query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const product = await Product.findOne({ _id });
      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      console.log("data =>", req.body);
      const productData: IProduct = req.body;
      if (
        !productData.name ||
        !productData.type ||
        !productData.description ||
        !productData.status
      ) {
        res
          .status(400)
          .json({ error: "Thiếu các trường bắt buộc cho products" });
        return;
      }
      productData.purchaseDate = new Date(productData.purchaseDate!);
      if (productData.expiryDate)
        productData.expiryDate = new Date(productData.expiryDate);
      if (productData.nextPayment)
        productData.nextPayment = new Date(productData.nextPayment);
      if (productData.lastAccessed)
        productData.lastAccessed = new Date(productData.lastAccessed);
      const product = new Product(productData);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
      }
      const updateData: Partial<IProduct> = req.body;
      if (updateData.purchaseDate)
        updateData.purchaseDate = new Date(updateData.purchaseDate);
      if (updateData.expiryDate)
        updateData.expiryDate = new Date(updateData.expiryDate);
      if (updateData.nextPayment)
        updateData.nextPayment = new Date(updateData.nextPayment);
      if (updateData.lastAccessed)
        updateData.lastAccessed = new Date(updateData.lastAccessed);

      const product = await Product.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData,
        { new: true, runValidators: true },
      );

      if (!product) {
        res
          .status(404)
          .json({ error: "Sản phẩm không tồn tại vui lòng thử lại" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
    }
  }
  public async updateBenefits(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { benefits } = req.body;

      if (!Array.isArray(benefits)) {
        res.status(400).json({ error: "benefits phải là một mảng" });
        return;
      }
      const product = await Product.findByIdAndUpdate(
        id,
        { benefits },
        { new: true, runValidators: true },
      );
      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra!", error });
    }
  }
  public async updateTimeline(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { timeline } = req.body;

      if (!Array.isArray(timeline)) {
        res.status(400).json({ error: "timeline phải là một mảng" });
        return;
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { timeline },
        { new: true, runValidators: true },
      );

      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra!", error });
    }
  }
  public async updateReports(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reports } = req.body;
      if (!Array.isArray(reports)) {
        res.status(400).json({ error: "reports phải là một mảng" });
        return;
      }
      const product = await Product.findByIdAndUpdate(
        id,
        { reports: reports },
        { new: true, runValidators: true },
      );
      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra!", error });
    }
  }
  public async updateFeatures(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { features } = req.body;
      if (!Array.isArray(features)) {
        res.status(400).json({ error: "features phải là một mảng" });
        return;
      }
      const product = await Product.findByIdAndUpdate(
        id,
        { features: features },
        { new: true, runValidators: true },
      );
      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra!", error });
    }
  }
  public async updateCertificates(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { certificates } = req.body;
      console.log(req.body);
      if (!Array.isArray(certificates)) {
        res.status(400).json({ error: "certificates phải là một mảng" });
        return;
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { certificates: certificates },
        { new: true, runValidators: true },
      );

      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra!", error });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await Product.findOneAndDelete({ id });

      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
    }
  }
}
export default new ProductController();
