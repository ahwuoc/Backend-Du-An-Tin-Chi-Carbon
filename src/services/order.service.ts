import Order from "../models/order.model";
import { Product, type IProduct } from "../models/products.model";
import type { IOrder } from "../models/order.model";
import { sendMailRegisterCheckout, sendEmail } from "../utils/email";
import mongoose from "mongoose";
import Affiliate from "../models/affiliate.model";
import { createPayOs, IData, IPayOs } from "../utils/payment";

export interface IOrderCreateData {
  email: string;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  productId: string;
  userId: string;
  note?: string;
  buyerAddress: string;
}

export interface IOrderService {
  createOrder(orderData: IOrderCreateData, baseUrl: string): Promise<{ order: IOrder; paymentLink?: string }>;
  getAllOrders(): Promise<IOrder[]>;
  getOrderById(id: string): Promise<IOrder | null>;
  getOrdersByUserId(userId: string): Promise<IOrder[]>;
  updateOrderStatus(id: string, status: string): Promise<IOrder | null>;
  deleteOrder(id: string): Promise<boolean>;
  validateOrderData(orderData: IOrderCreateData): string[];
  generateOrderCode(): number;
  handleFreeProductOrder(orderData: IOrderCreateData, product: IProduct): Promise<IOrder>;
  handlePaidProductOrder(orderData: IOrderCreateData, product: IProduct, baseUrl: string): Promise<{ order: IOrder; paymentLink: string }>;
}

export class OrderService implements IOrderService {
  public async createOrder(
    orderData: IOrderCreateData,
    baseUrl: string,
  ): Promise<{ order: IOrder; paymentLink?: string }> {
    const product = await Product.findById(orderData.productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const affiliate = await Affiliate.findOne({ userId: orderData.userId });
    const referralCode = affiliate?.referralCode || null;

    if (product.subscriptionTier === "free") {
      const order = await this.handleFreeProductOrder(orderData, product);
      return { order };
    } else {
      return await this.handlePaidProductOrder(orderData, product, baseUrl);
    }
  }

  public async getAllOrders(): Promise<IOrder[]> {
    return await Order.find().populate("productId").populate("userId");
  }

  public async getOrderById(id: string): Promise<IOrder | null> {
    return await Order.findById(id).populate("productId").populate("userId");
  }

  public async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return await Order.find({ userId }).populate("productId");
  }

  public async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }

  public async deleteOrder(id: string): Promise<boolean> {
    const result = await Order.findByIdAndDelete(id);
    return !!result;
  }

  public validateOrderData(orderData: IOrderCreateData): string[] {
    const errors: string[] = [];
    const requiredFields = [
      "email",
      "buyerName",
      "buyerPhone",
      "amount",
      "productId",
      "userId",
      "buyerAddress",
    ];

    for (const field of requiredFields) {
      if (
        !orderData[field as keyof IOrderCreateData] ||
        orderData[field as keyof IOrderCreateData] === ""
      ) {
        errors.push(`Thiếu thông tin bắt buộc: ${field}`);
      }
    }

    return errors;
  }

  public generateOrderCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  public async handleFreeProductOrder(
    orderData: IOrderCreateData,
    product: IProduct,
  ): Promise<IOrder> {
    const dataPayos: IData = {
      buyerAddress: orderData.buyerAddress,
      buyerName: orderData.buyerName,
      buyerPhone: orderData.buyerPhone,
      items: [
        {
          name: product.name,
          quantity: 1,
          price: orderData.amount,
        },
      ],
    };

    const mailContent = sendMailRegisterCheckout(dataPayos, orderData.amount);
    await sendEmail(orderData.email, "Gửi đơn hàng", mailContent);

    const order = new Order({
      orderCode: this.generateOrderCode(),
      amount: 1,
      status: "success",
      referralCode: null,
      buyerPhone: orderData.buyerPhone,
      buyerAddress: orderData.buyerAddress,
      buyerEmail: orderData.email,
      productId: new mongoose.Types.ObjectId(orderData.productId),
      userId: new mongoose.Types.ObjectId(orderData.userId),
      createdAt: new Date(),
      buyerName: orderData.buyerName,
      paymentLinkId: null,
      linkthanhtoan: null,
      expiredAt: null,
    });

    return await order.save();
  }

  public async handlePaidProductOrder(
    orderData: IOrderCreateData,
    product: IProduct,
    baseUrl: string,
  ): Promise<{ order: IOrder; paymentLink: string }> {
    const affiliate = await Affiliate.findOne({ userId: orderData.userId });
    const referralCode = affiliate?.referralCode || null;

    const payos: IPayOs = {
      orderCode: this.generateOrderCode(),
      amount: orderData.amount,
      description: orderData.note || "",
      cancelUrl: `${baseUrl}/cancel`,
      returnUrl: `${baseUrl}/success`,
    };

    const data: IData = {
      buyerName: orderData.buyerName,
      buyerEmail: orderData.email,
      buyerPhone: orderData.buyerPhone,
      buyerAddress: orderData.buyerAddress,
      items: [
        {
          name: product.name,
          quantity: 1,
          price: orderData.amount,
        },
      ],
    };

    const paymentResult = await createPayOs(payos, data);

    const order = new Order({
      orderCode: this.generateOrderCode(),
      amount: orderData.amount,
      status: "pending",
      referralCode,
      buyerPhone: orderData.buyerPhone,
      buyerAddress: orderData.buyerAddress,
      buyerEmail: orderData.email,
      productId: new mongoose.Types.ObjectId(orderData.productId),
      userId: new mongoose.Types.ObjectId(orderData.userId),
      createdAt: new Date(),
      buyerName: orderData.buyerName,
      paymentLinkId: paymentResult.data.paymentLinkId,
      linkthanhtoan: paymentResult.data.checkoutUrl,
      expiredAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    const savedOrder = await order.save();
    return { order: savedOrder, paymentLink: paymentResult.data.checkoutUrl };
  }
}

export default new OrderService();
