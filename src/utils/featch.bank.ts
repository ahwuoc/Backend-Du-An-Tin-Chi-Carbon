import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface Order {
  amount: number;
  orderCode: string;
  description: string;
  [key: string]: any;
}

const CLIENT_ID = process.env.PAYOS_CLIENT_ID!;
const API_KEY = process.env.PAYOS_API_KEY!;
const CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY!;
const baseUrl = process.env.FRONT_END_URL ?? "http://localhost:3000";

const HEADERS = {
  "Content-Type": "application/json",
  "x-client-id": CLIENT_ID,
  "x-api-key": API_KEY,
};

const currentTime = Math.floor(Date.now() / 1000);
const expiredAt = currentTime + 3600;

function createSignature(
  order: Order,
  cancelUrl: string,
  returnUrl: string,
): string {
  const rawSignature = `amount=${order.amount}&cancelUrl=${cancelUrl}&description=${order.description}&orderCode=${order.orderCode}&returnUrl=${returnUrl}`;
  return crypto
    .createHmac("sha256", CHECKSUM_KEY)
    .update(rawSignature)
    .digest("hex");
}

export async function createOrder(order: Order): Promise<any> {
  const cancelUrl = `${baseUrl}/huy-don`;
  const returnUrl = `${baseUrl}/hoan-thanh`;

  if (!order.amount || !order.orderCode || !order.description) {
    throw new Error("⚠️ Thiếu thông tin bắt buộc của order");
  }

  const signature = createSignature(order, cancelUrl, returnUrl);

  const payload = {
    ...order,
    expiredAt,
    cancelUrl,
    returnUrl,
    signature,
  };

  // 🔍 Log rõ ràng hơn
  console.log("📦 Payload gửi đến PayOS:", JSON.stringify(payload, null, 2));
  console.log("📨 Headers:", HEADERS);

  try {
    const response = await axios.post(
      "https://api-merchant.payos.vn/v2/payment-requests",
      payload,
      { headers: HEADERS },
    );

    console.log("✅ Phản hồi từ PayOS:", response.data);
    return response.data;
  } catch (error: any) {
    const errData = error.response?.data || error.message;
    console.error("❌ Lỗi từ PayOS:", errData);
    throw new Error(`Error from PayOS: ${JSON.stringify(errData)}`);
  }
}

export async function getOrderPaymentInfo(orderId: string): Promise<any> {
  const url = `https://api-merchant.payos.vn/v2/payment-requests/${orderId}`;
  try {
    const response = await axios.get(url, { headers: HEADERS });
    return response.data;
  } catch (error: any) {
    const errData = error.response?.data || error.message;
    console.error("❌ Lỗi khi lấy thông tin thanh toán:", errData);
    throw new Error("Có lỗi xảy ra khi lấy thông tin thanh toán");
  }
}

export async function getOrderPaymentInfo(orderId: string): Promise<any> {
  try {
    const url = `https://api-merchant.payos.vn/v2/payment-requests/${orderId}`;
    const response = await axios.get(url, {
      headers: {
        "x-client-id": CLIENT_ID,
        "x-api-key": API_KEY,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy thông tin link thanh toán:",
      error.response?.data || error.message,
    );
    throw new Error("Có lỗi xảy ra khi lấy thông tin");
  }
}
