import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const CLIENT_ID = process.env.PAYOS_CLIENT_ID!;
const API_KEY = process.env.PAYOS_API_KEY!;
const CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY!;

const HEADERS = {
  "Content-Type": "application/json",
  "x-client-id": CLIENT_ID,
  "x-api-key": API_KEY,
};

const currentTime = Math.floor(Date.now() / 1000);
const expired_at = currentTime + 3600;

function createSignature(data: IData, payos: IPayOs): string {
  const rawSignature = `amount=${payos.amount}&cancelUrl=${payos.cancelUrl}&description=${payos.description}&orderCode=${payos.orderCode}&returnUrl=${payos.returnUrl}`;
  return crypto
    .createHmac("sha256", CHECKSUM_KEY)
    .update(rawSignature)
    .digest("hex");
}
interface Item {
  name: string;
  quantity: number;
  price: number;
}
// =======Require=====
export interface IPayOs {
  orderCode: number;
  amount: number;
  description: string;
  cancelUrl: string;
  returnUrl: string;
}
// =======No Require====
export interface IData {
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  items?: Item[];
}

export async function createPayOs(payos: IPayOs, data: IData): Promise<any> {
  if (!CLIENT_ID || !API_KEY) {
    console.log("Vui lòng điền CLIENT_ID và  API_KEY ");
    return;
  }
  const signature = createSignature(data, payos);

  const payload = {
    ...data,
    ...payos,
    expired_at: expired_at,
    signature,
  };

  console.log("📦 Callback URLs:", {
    cancelUrl: payos.cancelUrl,
    returnUrl: payos.returnUrl,
  });
  console.log(
    "✅ Payload đúng định dạng gửi PayOS:",
    JSON.stringify(payload, null, 2),
  );
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
