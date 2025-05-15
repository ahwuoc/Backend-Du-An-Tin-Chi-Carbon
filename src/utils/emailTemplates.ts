import { IOrder } from "../models/order.model";

export const verifyEmailContent = (link: string) => {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 24px;
              color: #4CAF50;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
            }
            .button {
              display: inline-block;
              background-color: #4CAF50;
              color: white;
              padding: 12px 20px;
              text-align: center;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              font-size: 14px;
              color: #888;
              text-align: center;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Xác Thực Tài Khoản</h1>
            <p>Chào bạn!</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại chúng tôi. Để hoàn tất việc đăng ký, vui lòng xác thực tài khoản của bạn bằng cách nhấp vào nút dưới đây:</p>
            <a href="${link}" class="button">Xác Thực Tài Khoản</a>
            <p>Chúng tôi sẽ không bao giờ yêu cầu bạn cung cấp mật khẩu qua email.</p>
            <div class="footer">
              <p>Trân trọng,</p>
              <p>Đội ngũ hỗ trợ khách hàng</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const sendMailRegisterCheckout = (product: any) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đăng ký thành công</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
      <div style="min-height: 100vh; background-color: #f3f4f6; padding: 48px 16px;">
        <div style="max-width: 768px; margin: 0 auto;">
          <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <!-- Card Header -->
            <div style="text-align: center; background-color: #ecfdf5; padding: 24px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <div style="margin: 0 auto 16px; background-color: #d1fae5; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg style="width: 40px; height: 40px; color: #16a34a;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style="font-size: 24px; color: #15803d; margin: 0;">Đăng ký thành công!</h2>
              <p style="color: #6b7280; margin: 8px 0 0;">Cảm ơn bạn đã chọn Tín Chỉ Carbon Việt Nam! 🎉</p>
            </div>

            <!-- Card Content -->
            <div style="padding: 24px;">
              <!-- Order Information -->
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Thông tin đơn hàng</h3>
                <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Giá tiền:</span> ${formatCurrency(product?.amount ?? 0)}</p>
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Họ tên:</span> ${product.buyerName || "N/A"}</p>
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Email:</span> ${product.buyerEmail || "N/A"}</p>
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Số điện thoại:</span> ${product.buyerPhone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
export function templateAfifliate({
  name,
  email,
  referralLink,
}: {
  name: string;
  email: string;
  referralLink: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #4f46e5; color: white; padding: 24px;">
        <h2 style="margin: 0;">Chào ${name} 👋</h2>
        <p>Cảm ơn bạn đã đăng ký chương trình Affiliate!</p>
      </div>
      <div style="padding: 24px;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Referral Link của bạn:</strong></p>
        <p>
          <a href="${referralLink}" style="color: #4f46e5; word-break: break-all;">
            ${referralLink}
          </a>
        </p>
        <hr style="margin: 24px 0;" />
        <p>
          Hãy chia sẻ link này đến bạn bè hoặc cộng đồng của bạn để kiếm hoa hồng khi họ đăng ký!
        </p>
        <p style="font-size: 14px; color: #888;">
          Nếu bạn có bất kỳ câu hỏi nào, đừng ngại liên hệ với chúng tôi.
        </p>
      </div>
      <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </div>
  </div>
  `;
}

export const resetPasswordContent = (link: string) => {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 24px;
              color: #4CAF50;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
            }
            .button {
              display: inline-block;
              background-color: #4CAF50;
              color: white;
              padding: 12px 20px;
              text-align: center;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              font-size: 14px;
              color: #888;
              text-align: center;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Đặt Lại Mật Khẩu</h1>
            <p>Chào bạn!</p>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Để đặt lại mật khẩu, vui lòng nhấp vào nút dưới đây:</p>
            <a href="${link}" class="button">Đặt Lại Mật Khẩu</a>
            <div class="footer">
              <p>Trân trọng,</p>
              <p>Đội ngũ hỗ trợ khách hàng</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

export const changePasswordNotificationContent = () => {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 24px;
              color: #4CAF50;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
            }
            .footer {
              font-size: 14px;
              color: #888;
              text-align: center;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Thông Báo Thay Đổi Mật Khẩu</h1>
            <p>Chào bạn,</p>
            <p>Chúng tôi muốn thông báo rằng mật khẩu tài khoản của bạn đã được thay đổi. Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
            <div class="footer">
              <p>Trân trọng,</p>
              <p>Đội ngũ hỗ trợ khách hàng</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
