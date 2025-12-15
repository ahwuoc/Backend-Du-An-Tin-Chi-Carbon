import type { Request, Response } from "express";
import { OrderService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError, ValidationError } from "../utils";

class OrderController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const orderData = req.body;
      const validationErrors = OrderService.validateOrderData(orderData);

      if (validationErrors.length > 0) {
        throw new ValidationError(
          `Thiếu thông tin bắt buộc: ${validationErrors.join(", ")}`,
          validationErrors
        );
      }

      let baseUrl =
        req.headers.referer?.toString() ||
        req.headers.origin?.toString() ||
        process.env.FRONT_END_URL;

      if (!baseUrl) {
        throw new BadRequestError("Không xác định được baseUrl");
      }

      baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      const result = await OrderService.createOrder(orderData, baseUrl);

      sendSuccess(
        res,
        "Tạo đơn hàng thành công",
        {
          order: result.order,
          paymentLink: result.paymentLink || null,
        },
        201
      );
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const orders = await OrderService.getAllOrders();
      sendSuccess(res, "Lấy danh sách đơn hàng thành công", orders, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Order ID là bắt buộc");

      const order = await OrderService.getOrderById(id);
      if (!order) throw new NotFoundError("Không tìm thấy đơn hàng");

      sendSuccess(res, "Lấy chi tiết đơn hàng thành công", order, 200);
    }
  );

  public getByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = req.params;
      if (!userId) throw new BadRequestError("User ID là bắt buộc");

      const orders = await OrderService.getOrdersByUserId(userId);
      sendSuccess(res, "Lấy đơn hàng theo user thành công", orders, 200);
    }
  );

  public updateStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) throw new BadRequestError("Order ID là bắt buộc");
      if (!status) throw new BadRequestError("Trạng thái đơn hàng là bắt buộc");

      const updatedOrder = await OrderService.updateOrderStatus(id, status);
      if (!updatedOrder) throw new NotFoundError("Không tìm thấy đơn hàng");

      sendSuccess(res, "Cập nhật trạng thái đơn hàng thành công", updatedOrder, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Order ID là bắt buộc");

      const isDeleted = await OrderService.deleteOrder(id);
      if (!isDeleted) throw new NotFoundError("Không tìm thấy đơn hàng");

      sendSuccess(res, "Xóa đơn hàng thành công", null, 200);
    }
  );
}

export default new OrderController();
