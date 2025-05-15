import { Request, Response } from "express";
import { CarbonProduct, ICarbonProduct } from "../models/carbonproduct";

export const createCarbonProduct = async (req: Request, res: Response) => {
  try {
    const productData: ICarbonProduct = req.body;
    const newProduct = new CarbonProduct(productData);
    await newProduct.save();
    res.status(201).json({
      message: "Tạo sản phẩm thành công!",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo sản phẩm!",
      error: (error as Error).message,
    });
  }
};

export const getAllCarbonProducts = async (req: Request, res: Response) => {
  try {
    const products = await CarbonProduct.find();
    res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công!",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sản phẩm!",
      error: (error as Error).message,
    });
  }
};

export const getCarbonProductById = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const product = await CarbonProduct.findOne({ _id });
    if (!product) {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm!",
      });
    }
    res.status(200).json({
      message: "Lấy sản phẩm thành công!",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy sản phẩm!",
      error: (error as Error).message,
    });
  }
};
export const updateCarbonProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<ICarbonProduct> = req.body;
    const updatedProduct = await CarbonProduct.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm để cập nhật!",
      });
    }
    res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật sản phẩm!",
      error: (error as Error).message,
    });
  }
};

// Delete a CarbonProduct by ID
export const deleteCarbonProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await CarbonProduct.findOneAndDelete({ id });
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm để xóa!",
      });
    }
    res.status(200).json({
      message: "Xóa sản phẩm thành công!",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa sản phẩm!",
      error: (error as Error).message,
    });
  }
};
