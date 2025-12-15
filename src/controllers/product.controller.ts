import type { Request, Response } from "express";
import { ProductService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError, ValidationError } from "../utils";

class ProductController {
  public getFreeTrialProduct = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const product = await ProductService.getFreeTrialProduct();
      if (!product) throw new NotFoundError("Không tìm thấy sản phẩm free trial");

      sendSuccess(res, "Lấy sản phẩm free trial thành công", product, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const products = await ProductService.getAllProducts();
      sendSuccess(res, "Lấy danh sách sản phẩm thành công", products, 200);
    }
  );

  public getProducts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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
      sendSuccess(res, "Lấy danh sách sản phẩm thành công", products, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const product = await ProductService.getProductById(id);
      if (!product) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Lấy sản phẩm thành công", product, 200);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const productData = req.body;
      const validationErrors = ProductService.validateProductData(productData);

      if (validationErrors.length > 0) {
        throw new ValidationError("Dữ liệu không hợp lệ", validationErrors);
      }

      const newProduct = await ProductService.createProduct(productData);
      sendSuccess(res, "Tạo sản phẩm thành công", newProduct, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const updatedProduct = await ProductService.updateProduct(id, req.body);
      if (!updatedProduct) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Cập nhật sản phẩm thành công", updatedProduct, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const isDeleted = await ProductService.deleteProduct(id);
      if (!isDeleted) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Xóa sản phẩm thành công", null, 200);
    }
  );

  public updateTimeline = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const updatedProduct = await ProductService.updateProduct(id, { timeline: req.body });
      if (!updatedProduct) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Cập nhật timeline thành công", updatedProduct, 200);
    }
  );

  public updateReports = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const updatedProduct = await ProductService.updateProduct(id, { reports: req.body });
      if (!updatedProduct) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Cập nhật reports thành công", updatedProduct, 200);
    }
  );

  public updateFeatures = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const updatedProduct = await ProductService.updateProduct(id, { features: req.body });
      if (!updatedProduct) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Cập nhật features thành công", updatedProduct, 200);
    }
  );

  public updateBenefits = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const updatedProduct = await ProductService.updateProduct(id, { benefits: req.body });
      if (!updatedProduct) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Cập nhật benefits thành công", updatedProduct, 200);
    }
  );

  public updateCertificates = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Product ID là bắt buộc");

      const updatedProduct = await ProductService.updateProduct(id, { certificates: req.body });
      if (!updatedProduct) throw new NotFoundError("Không tìm thấy sản phẩm");

      sendSuccess(res, "Cập nhật certificates thành công", updatedProduct, 200);
    }
  );
}

export default new ProductController();
