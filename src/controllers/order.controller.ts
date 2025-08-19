import type { Request, Response } from "express";
import { OrderService } from "../services";

class OrderController {
  async create(req: Request, res: Response) {
    try {
      const orderData = req.body;
      const validationErrors = OrderService.validateOrderData(orderData);

      if (validationErrors.length > 0) {
        res.status(400).json({
          error: `Thiếu thông tin bắt buộc: ${validationErrors.join(", ")}`,
        });
        return;
      }

      // Xác định baseUrl
      let baseUrl =
        req.headers.referer?.toString() ||
        req.headers.origin?.toString() ||
        process.env.FRONT_END_URL;
      if (!baseUrl) {
        throw new Error("❌ Không xác định được baseUrl");
      }
      baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

      const result = await OrderService.createOrder(orderData, baseUrl);
      
      if (result.paymentLink) {
        res.status(201).json({
          order: result.order,
          paymentLink: result.paymentLink,
        });
      } else {
        res.status(201).json(result.order);
      }
    } catch (error: any) {
      console.error("Lỗi tạo đơn hàng:", error);
      res.status(500).json({
        error: error.message || "Lỗi server khi tạo đơn hàng",
      });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      res.status(500).json({
        error: "Lỗi server khi lấy danh sách đơn hàng",
      });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      
      if (!order) {
        res.status(404).json({
          error: "Không tìm thấy đơn hàng",
        });
        return;
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
      res.status(500).json({
        error: "Lỗi server khi lấy chi tiết đơn hàng",
      });
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await OrderService.getOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng theo user:", error);
      res.status(500).json({
        error: "Lỗi server khi lấy đơn hàng theo user",
      });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          error: "Trạng thái đơn hàng là bắt buộc",
        });
        return;
      }

      const updatedOrder = await OrderService.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        res.status(404).json({
          error: "Không tìm thấy đơn hàng",
        });
        return;
      }

      res.status(200).json({
        message: "Cập nhật trạng thái đơn hàng thành công",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
      res.status(500).json({
        error: "Lỗi server khi cập nhật trạng thái đơn hàng",
      });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const isDeleted = await OrderService.deleteOrder(id);
      
      if (!isDeleted) {
        res.status(404).json({
          error: "Không tìm thấy đơn hàng",
        });
        return;
      }

      res.status(200).json({
        message: "Xóa đơn hàng thành công",
      });
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);
      res.status(500).json({
        error: "Lỗi server khi xóa đơn hàng",
      });
    }
  }
}

export default new OrderController();
