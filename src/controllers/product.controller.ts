import { Request, Response } from "express";
import { Product, IProduct } from "../models/products.model";

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
      const productData: Partial<IProduct> = req.body;
      if (
        !productData.name ||
        !productData.type ||
        !productData.description ||
        !productData.purchaseDate ||
        !productData.status
      ) {
        res.status(400).json({ error: "Thiếu các trường bắt buộc" });
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
      const { id } = req.params;
      const updateData: Partial<IProduct> = req.body;
      if (updateData.purchaseDate)
        updateData.purchaseDate = new Date(updateData.purchaseDate);
      if (updateData.expiryDate)
        updateData.expiryDate = new Date(updateData.expiryDate);
      if (updateData.nextPayment)
        updateData.nextPayment = new Date(updateData.nextPayment);
      if (updateData.lastAccessed)
        updateData.lastAccessed = new Date(updateData.lastAccessed);

      const product = await Product.findOneAndUpdate({ id }, updateData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
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
