import type { Request, Response } from "express";
import Order from "../models/order.model";
import { Product, type IProduct } from "../models/products.model";
import type { IOrder } from "../models/order.model";
import { sendMailRegisterCheckout } from "../utils/emailTemplates";
import { sendEmail } from "../utils/sendEmail";
import { createOrder } from "../utils/featch.bank";
import mongoose from "mongoose";
import Affiliate from "../models/affiliate.model";

type OrderSend = Partial<IOrder>;
class OrderController {
  async create(req: Request, res: Response) {
    try {
      const {
        email,
        buyerName,
        buyerPhone,
        amount,
        productId,
        userId,
        note,
        buyerAddress,
      } = req.body;

      const missingFields = Object.entries(req.body)
        .filter(
          ([, value]) => value === undefined || value === null || value === "",
        )
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.log("Missing required fields:", missingFields);
        res.status(400).json({
          error: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
        });
        return;
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(400).json({
          error: "Sản phẩm không tồn tại",
        });
        return;
      }

      const affiliate = await Affiliate.findOne({ userId });
      const referralCode = affiliate?.referralCode || null;

      const random6Digits = Math.floor(100000 + Math.random() * 900000);
      const OrderBank = {
        orderCode: random6Digits,
        amount,
        description: note,
        buyerName,
        buyerEmail: email,
        buyerPhone,
        buyerAddress,
      };

      // FREE PRODUCT
      if (product.subscriptionTier === "free") {
        const mailContent = sendMailRegisterCheckout(OrderBank);
        const emailResult = await sendEmail(email, "Gửi đơn hàng", mailContent);

        const orderData = new Order({
          orderCode: OrderBank.orderCode,
          amount: 1,
          status: "success",
          referralCode,
          buyerPhone,
          buyerAddress,
          buyerEmail: email,
          productId: new mongoose.Types.ObjectId(productId),
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: new Date(),
          buyerName,
          paymentLinkId: null,
          linkthanhtoan: null,
          expiredAt: null,
        });

        console.log("Saving order:", orderData);
        await orderData.save();
        console.log("Order saved successfully:", orderData.orderCode);

        res.status(201).json(orderData);
        return;
      }
      // ================Fix============
      let baseUrl = req.headers.referer || req.headers.origin || "Unknown";
      baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      // ==============End Fix======
      const response = await createOrder(OrderBank, baseUrl);
      if (response.code === "00") {
        const mailContent = sendMailRegisterCheckout(OrderBank);
        const emailResult = await sendEmail(email, "Gửi đơn hàng", mailContent);
        if (!emailResult.success) {
          console.error("Email failed:", emailResult.error);
        } else {
          console.log("Email sent successfully to:", email);
        }
        const orderData = new Order({
          orderCode: response.data.orderCode,
          amount: response.data.amount + 1,
          linkthanhtoan: response.data.checkoutUrl,
          status: "pending",
          referralCode,
          buyerPhone,
          buyerAddress,
          buyerEmail: email,
          paymentLinkId: response.data.paymentLinkId,
          productId: new mongoose.Types.ObjectId(productId),
          expiredAt: response.data.expiredAt,
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: new Date(),
          buyerName,
        });

        console.log("Saving order:", orderData);
        await orderData.save();
        console.log("Order saved successfully:", orderData.orderCode);

        res.status(201).json(orderData);
        return;
      }
      console.error("Payment system error:", response);
      res.status(500).json({
        error: "Lỗi khi gửi đơn hàng tới hệ thống thanh toán.",
      });
      return;
    } catch (err: any) {
      console.error("Create order failed:", err.message);
      res.status(400).json({
        error: "Tạo đơn hàng thất bại",
        details: err.message,
      });
      return;
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const orders = await Order.find()
        .populate("userId")
        .populate("productId"); // hoặc "projectId" nếu cần
      res.status(200).json(orders);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Không thể lấy danh sách đơn hàng", details: err });
    }
  }
  async getProjectForOrder(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const orders = await Order.find({ userId }).lean();
      if (!orders || orders.length === 0) {
        res.status(404).json({ message: "No orders found for this user." });
      }
      const ordersWithPaymentStatus = orders.map((order) => ({
        ...order,
        paymentStatus: order.paymentStatus ?? "unknown",
      }));
      const productIds = orders
        .map((order) => order.productId)
        .filter((id) => id);
      if (productIds.length === 0) {
        res
          .status(404)
          .json({ message: "No valid product IDs found in orders." });
      }
      const products = await Product.find({ _id: { $in: productIds } }).lean();
      if (!products || products.length === 0) {
        res
          .status(404)
          .json({ message: "No products found for these orders." });
      }
      res.status(200).json({
        orders: ordersWithPaymentStatus,
        products,
      });
    } catch (error) {
      console.error("Error in getProjectForOrder:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching data." });
    }
  }
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id)
        .populate("userId")
        .populate("productId");
      if (!order) res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: "Không thể lấy đơn hàng", details: err });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updatedOrder)
        res.status(404).json({ error: "Đơn hàng không tồn tại" });
      res.status(200).json(updatedOrder);
    } catch (err) {
      res
        .status(400)
        .json({ error: "Cập nhật đơn hàng thất bại", details: err });
    }
  }
  async getInfo(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
      const orders: IOrder[] = await Order.find({ userId }).populate(
        "productId",
      );

      const pendingOrders = orders.filter(
        (order) => order.status === "pending",
      );
      const successOrders = orders.filter(
        (order) => order.status === "success",
      );

      const totalPendingAmount = pendingOrders.reduce(
        (acc, order) => acc + (order.amount || 0),
        0,
      );
      const totalSuccessAmount = successOrders.reduce(
        (acc, order) => acc + (order.amount || 0),
        0,
      );
      res.json({
        totalOrders: orders.length,
        totalAmount: totalPendingAmount + totalSuccessAmount,
        totalPendingOrders: pendingOrders.length,
        totalSuccessOrders: successOrders.length,
        totalPendingAmount,
        totalSuccessAmount,
        pendingOrders,
        successOrders,
      });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      let orderCode = req.params.orderCode;
      orderCode = orderCode;
      const deletedOrder = await Order.findOneAndDelete({ orderCode });
      if (!deletedOrder) {
        res.status(404).json({ error: "Không tìm thấy đơn hàng để xoá" });
        return;
      }
      res.status(200).json({ message: "Xoá đơn hàng thành công" });
      return;
    } catch (err) {
      res.status(500).json({ error: "Xoá đơn hàng thất bại", details: err });
    }
  }
  async getFilterOrder(req: Request, res: Response) {
    const userId = req.params.id;
    const status = req.query.status as string | undefined;
    if (!userId) {
      res.status(404).json({ message: "Vui lòng gửi kèm uid" });
      return;
    }
    const filter: any = { userId };
    if (status) {
      filter.status = status; // chỉ thêm status khi có
    }
    try {
      const orders = await Order.find(filter);
      res.status(200).json(orders);
      return;
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
      return;
    }
  }
  async deleteId(req: Request, res: Response) {
    try {
      let _id = req.params.id;
      const deletedOrder = await Order.findOneAndDelete({ _id });
      if (!deletedOrder) {
        res.status(404).json({ error: "Không tìm thấy đơn hàng để xoá" });
        return;
      }
      res.status(200).json({ message: "Xoá đơn hàng thành công" });
      return;
    } catch (err) {
      res.status(500).json({ error: "Xoá đơn hàng thất bại", details: err });
    }
  }
}

export default new OrderController();
