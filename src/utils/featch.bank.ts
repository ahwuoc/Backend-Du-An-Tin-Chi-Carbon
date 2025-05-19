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

const currentTime = Math.floor(Date.now() / 1000);
const expiredAt = currentTime + 3600;
function createSignature(
  order: any,
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
  const baseUrl = process.env.FRONT_END_URL ?? "http://localhost:3000";
  const cancelUrl = `${baseUrl}/huy-don`;
  const returnUrl = `${baseUrl}/hoan-thanh`;

  // Bắt lỗi nếu thiếu dữ liệu quan trọng
  if (!order.amount || !order.orderCode || !order.description) {
    throw new Error("Thiếu thông tin bắt buộc của order");
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expiredAt = currentTime + 3600;

  const signature = createSignature(order, cancelUrl, returnUrl);

  const payload = {
    ...order,
    expiredAt,
    cancelUrl,
    returnUrl,
    signature,
  };

  // 👉 Log payload gửi đi
  console.log("📦 Payload gửi đến PayOS:", payload);

  try {
    const response = await axios.post(
      "https://api-merchant.payos.vn/v2/payment-requests",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CLIENT_ID,
          "x-api-key": API_KEY,
        },
      },
    );

    // ✅ Log response nhận về
    console.log("✅ Phản hồi từ PayOS:", response.data);
    return response.data;
  } catch (error: any) {
    // ❌ Log lỗi chi tiết
    console.error(
      "❌ PayOS trả về lỗi:",
      error.response?.data || error.message,
    );
    throw new Error(
      `Error from PayOS: ${error.response?.data || error.message}`,
    );
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
