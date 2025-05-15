import { Request, Response } from "express";
import Order from "../models/order.model";
import { Product, IProduct } from "../models/products.model";
import { IOrder } from "../models/order.model";
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
        buyerAddress,
        status,
        nameItem,
      } = req.body;
      const missingFields = Object.entries(req.body)
        .filter(
          ([_, value]) => value === undefined || value === null || value === ""
        )
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.log("Missing required fields:", missingFields);
        res.status(400).json({
          error: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
        });
        return;
      }
      const affiliate = await Affiliate.findOne({ userId });
      const referralCode = affiliate?.referralCode || null;
      console.log("Affiliate lookup:", { userId, referralCode });
      const OrderBank = {
        orderCode: Date.now(),
        amount: amount,
        description: "Thanh toán vui vẻ",
        buyerName: buyerName,
        buyerEmail: email,
        buyerPhone: buyerPhone,
        buyerAddress: buyerAddress,
      };
      const response = await createOrder(OrderBank);
      console.log("Create order response:", response);
      if (response.code === "00") {
        console.log("Sending email to:", email);
        const mailContent = sendMailRegisterCheckout(OrderBank);
        const emailResult = await sendEmail(email, "Gửi đơn hàng", mailContent);
        if (!emailResult.success) {
          console.error("Email failed:", emailResult.error);
        } else {
          console.log("Email sent successfully to:", email);
        }
        const orderData = new Order({
          orderCode: `MA_ORDER-${response.data.orderCode}`,
          amount: response.data.amount + 1,
          linkthanhtoan: response.data.checkoutUrl,
          status: "pending",
          referralCode: referralCode,
          buyerPhone: buyerPhone,
          buyerAddress: buyerAddress,
          buyerEmail: email,
          paymentLinkId: response.data.paymentLinkId,
          productId: new mongoose.Types.ObjectId(productId),
          expiredAt: response.data.expiredAt,
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: new Date(),
          buyerName: buyerName,
        });
        console.log("Saving order:", orderData);
        await orderData.save();
        console.log("Order saved successfully:", orderData.orderCode);

        res.status(201).json(orderData);
      } else {
        console.error("Payment system error:", response);
        res
          .status(500)
          .json({ error: "Lỗi khi gửi đơn hàng tới hệ thống thanh toán." });
      }
    } catch (err: any) {
      console.error("Create order failed:", err.message);
      res
        .status(400)
        .json({ error: "Tạo đơn hàng thất bại", details: err.message });
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
        paymentStatus: order.paymentStatus ?? "unknown", // Xử lý trường hợp paymentStatus undefined
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
        "productId"
      );

      res.json({ orders });
      return;
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      let orderCode = req.params.orderCode;
      orderCode = `MA_ORDER-${orderCode}`;
      console.log(orderCode);
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
