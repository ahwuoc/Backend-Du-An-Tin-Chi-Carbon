import type { Request, Response } from "express";
import { ProductService } from "../services";

class ProductController {
  public async getFreeTrialProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getFreeTrialProduct();
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
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { type, status, search, price, priceMin, priceMax } = req.query;
      const query = {
        type: type as string,
        status: status as string,
        search: search as string,
        price: price as string,
        priceMin: priceMin as string,
        priceMax: priceMax as string,
      };

      const products = await ProductService.getProducts(query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const product = await ProductService.getProductById(_id);
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
      const productData = req.body;
      const validationErrors = ProductService.validateProductData(productData);
      
      if (validationErrors.length > 0) {
        res
          .status(400)
          .json({ error: "Dữ liệu không hợp lệ", details: validationErrors });
        return;
      }

      const newProduct = await ProductService.createProduct(productData);
      res.status(201).json({
        message: "Sản phẩm đã được tạo thành công!",
        data: newProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const updateData = req.body;

      const updatedProduct = await ProductService.updateProduct(_id, updateData);
      if (!updatedProduct) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({
        message: "Sản phẩm đã được cập nhật thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const isDeleted = await ProductService.deleteProduct(_id);
      
      if (!isDeleted) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({
        message: "Sản phẩm đã được xóa thành công!",
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async updateTimeline(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const timelineData = req.body;

      const updatedProduct = await ProductService.updateProduct(_id, { timeline: timelineData });
      if (!updatedProduct) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({
        message: "Timeline đã được cập nhật thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async updateReports(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const reportsData = req.body;

      const updatedProduct = await ProductService.updateProduct(_id, { reports: reportsData });
      if (!updatedProduct) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({
        message: "Reports đã được cập nhật thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async updateFeatures(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const featuresData = req.body;

      const updatedProduct = await ProductService.updateProduct(_id, { features: featuresData });
      if (!updatedProduct) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({
        message: "Features đã được cập nhật thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async updateBenefits(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const benefitsData = req.body;

      const updatedProduct = await ProductService.updateProduct(_id, { benefits: benefitsData });
      if (!updatedProduct) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({
        message: "Benefits đã được cập nhật thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }

  public async updateCertificates(req: Request, res: Response): Promise<void> {
    try {
      const _id = req.params.id;
      const certificatesData = req.body;

      const updatedProduct = await ProductService.updateProduct(_id, { certificates: certificatesData });
      if (!updatedProduct) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }

      res.status(200).json({
        message: "Certificates đã được cập nhật thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Đã có lỗi xảy ra!", error });
    }
  }
}

export default new ProductController();
