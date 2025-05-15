import crypto from "crypto";
import fetch from "node-fetch";

const CLIENT_ID = "5c0c22e2-b45f-4dcc-85dd-6a366a44c7d6";
const API_KEY = "446cfd67-a5aa-45f2-86d2-1a3908dffb13";
const CHECKSUM_KEY =
  "861a796606578362e119f3f83192035c9390c43b1c46d91b0fddee17deef9ef6";
const currentTime = Math.floor(Date.now() / 1000);
const expiredAt = currentTime + 3600;

export async function createOrder(order: any): Promise<any> {
  const cancelUrl = "http://localhost:3000/huy-don";
  const returnUrl = "http://localhost:3000/hoan-thanh";

  try {
    const rawSignature = `amount=${order.amount}&cancelUrl=${cancelUrl}&description=${order.description}&orderCode=${order.orderCode}&returnUrl=${returnUrl}`;
    const signature = crypto
      .createHmac("sha256", CHECKSUM_KEY)
      .update(rawSignature)
      .digest("hex");
    const payload = {
      ...order,
      expiredAt,
      cancelUrl,
      returnUrl,
      signature,
    };
    const response = await fetch(
      "https://api-merchant.payos.vn/v2/payment-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CLIENT_ID,
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ PayOS trả về lỗi:", errorData);
      throw new Error(`Error from PayOS: ${JSON.stringify(errorData)}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi tạo đơn hàng");
  }
}
export async function getOrderPaymentInfo(orderId: string): Promise<any> {
  try {
    const url = `https://api-merchant.payos.vn/v2/payment-requests/${orderId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-client-id": CLIENT_ID, // Dùng hằng số
        "x-api-key": API_KEY, // Dùng hằng số
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching payment info: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin link thanh toán:", error);
    throw new Error("Có lỗi xảy ra khi lấy thông tin");
  }
}
