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
// utils/emailTemplates.ts (hoặc services/emailService.ts)

// Hàm này dùng để gửi xác nhận cho khách hàng khi họ vừa gửi yêu cầu tư vấn
export const sendMailConsultationConfirmation = (consultationData: {
  name: string;
  email: string;
  phone: string;
  organization: string;
  consultationType: string;
  projectType: string;
  projectSize: string;
  message: string;
  status: string;
  // Các trường khác từ form đăng ký ban đầu nếu bạn muốn đưa vào email xác nhận
  // Ví dụ: age, location, area, position, experience, education,
  // projectLocation, implementationTimeline, budget, carbonGoals, etc.
}) => {
  const consultationTypeMap: Record<string, string> = {
    forest: "Trồng rừng",
    carbon: "Carbon Offset",
    biochar: "Biochar",
    agriculture: "Nông nghiệp",
    csu: "CSU",
    carbonbook: "Carbonbook",
    other: "Khác",
  };

  const statusMap: Record<string, string> = {
    pending: "Đang chờ xử lý",
    in_progress: "Đang xử lý",
    completed: "Đã hoàn thành",
    cancelled: "Đã hủy",
  };

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác nhận Yêu cầu Tư vấn</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif; }
        .container { min-height: 100vh; background-color: #f3f4f6; padding: 48px 16px; }
        .card { max-width: 768px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card-header { text-align: center; background-color: #ecfdf5; padding: 24px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .icon-circle { margin: 0 auto 16px; background-color: #d1fae5; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .icon { width: 40px; height: 40px; color: #16a34a; }
        .title { font-size: 24px; color: #15803d; margin: 0; }
        .subtitle { color: #6b7280; margin: 8px 0 0; }
        .card-content { padding: 24px; }
        .info-section { margin-bottom: 24px; }
        .section-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
        .info-box { background-color: #f9fafb; padding: 16px; border-radius: 8px; }
        .info-item { margin: 8px 0; }
        .info-label { font-weight: 600; color: #4a5568; margin-right: 8px; }
        .info-value { color: #1a202c; }
        .message-box { margin-top: 16px; padding: 16px; background-color: #f0f4f8; border-left: 4px solid #3b82f6; border-radius: 4px; }
        .message-label { font-weight: 600; color: #3b82f6; margin-bottom: 8px; }
        .message-content { color: #333; line-height: 1.5; }
        .footer-text { text-align: center; margin-top: 32px; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="card-header">
            <div class="icon-circle">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="title">Yêu cầu tư vấn của bạn đã được gửi!</h2>
            <p class="subtitle">Cảm ơn bạn đã tin tưởng Tín Chỉ Carbon Việt Nam. Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ lại sớm nhất có thể. 🎉</p>
          </div>

          <div class="card-content">
            <div class="info-section">
              <h3 class="section-title">Thông tin của bạn</h3>
              <div class="info-box">
                <p class="info-item"><span class="info-label">Họ tên:</span> <span class="info-value">${
                  consultationData.name || "N/A"
                }</span></p>
                <p class="info-item"><span class="info-label">Email:</span> <span class="info-value">${
                  consultationData.email || "N/A"
                }</span></p>
                <p class="info-item"><span class="info-label">Số điện thoại:</span> <span class="info-value">${
                  consultationData.phone || "N/A"
                }</span></p>
                <p class="info-item"><span class="info-label">Tổ chức:</span> <span class="info-value">${
                  consultationData.organization || "N/A"
                }</span></p>
              </div>
            </div>

            <div class="info-section">
              <h3 class="section-title">Chi tiết yêu cầu tư vấn</h3>
              <div class="info-box">
                <p class="info-item"><span class="info-label">Loại tư vấn:</span> <span class="info-value">${
                  consultationTypeMap[consultationData.consultationType] ||
                  "Khác"
                }</span></p>
                <p class="info-item"><span class="info-label">Loại dự án:</span> <span class="info-value">${
                  consultationData.projectType || "N/A"
                }</span></p>
                <p class="info-item"><span class="info-label">Quy mô dự án:</span> <span class="info-value">${
                  consultationData.projectSize || "N/A"
                }</span></p>
                <p class="info-item"><span class="info-label">Trạng thái:</span> <span class="info-value">${
                  statusMap[consultationData.status] || "Đang chờ xử lý"
                }</span></p>
              </div>
            </div>

            ${
              consultationData.message
                ? `
            <div class="message-box">
              <p class="message-label">Lời nhắn của bạn:</p>
              <p class="message-content">${consultationData.message}</p>
            </div>
            `
                : ""
            }
          </div>
        </div>
        <p class="footer-text">
          Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.
          <br/>
          Tín Chỉ Carbon Việt Nam
        </p>
      </div>
    </body>
    </html>
  `;
};

export const sendMailConsultationFeedback = (
  customerName: string,
  customerEmail: string,
  feedbackContent: string,
) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Phản hồi về Yêu cầu Tư vấn của bạn</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif; }
        .container { min-height: 100vh; background-color: #f3f4f6; padding: 48px 16px; }
        .card { max-width: 768px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card-header { text-align: center; background-color: #e0f2f7; padding: 24px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .icon-circle { margin: 0 auto 16px; background-color: #a7d9ed; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .icon { width: 40px; height: 40px; color: #0284c7; }
        .title { font-size: 24px; color: #0c4a6e; margin: 0; }
        .subtitle { color: #6b7280; margin: 8px 0 0; }
        .card-content { padding: 24px; }
        .feedback-box { background-color: #f0f4f8; padding: 20px; border-radius: 8px; border: 1px solid #bfdbfe; margin-bottom: 24px; }
        .feedback-label { font-size: 18px; font-weight: 600; color: #1d4ed8; margin-bottom: 12px; }
        .feedback-content { color: #333; line-height: 1.6; white-space: pre-wrap; } /* pre-wrap để giữ định dạng xuống dòng */
        .closing-note { margin-top: 24px; color: #333; line-height: 1.5; }
        .footer-text { text-align: center; margin-top: 32px; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="card-header">
            <div class="icon-circle">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2h-5l-5 5V8l2 2z" />
              </svg>
            </div>
            <h2 class="title">Phản hồi về yêu cầu tư vấn của bạn</h2>
            <p class="subtitle">Chào ${customerName || "bạn"},</p>
            <p class="subtitle">Chúng tôi đã xem xét yêu cầu tư vấn của bạn và có phản hồi như sau:</p>
          </div>

          <div class="card-content">
            <div class="feedback-box">
              <p class="feedback-label">Nội dung phản hồi từ Tín Chỉ Carbon Việt Nam:</p>
              <p class="feedback-content">${feedbackContent}</p>
            </div>

            <p class="closing-note">
              Chúng tôi hy vọng phản hồi này hữu ích cho bạn. Nếu bạn có bất kỳ câu hỏi hoặc cần thêm thông tin, xin đừng ngần ngại liên hệ lại với chúng tôi.
            </p>
            <p class="closing-note">
              Trân trọng,<br/>
              **Đội ngũ Tín Chỉ Carbon Việt Nam**
            </p>
          </div>
        </div>
        <p class="footer-text">
          Bạn nhận được email này vì đã gửi yêu cầu tư vấn tới Tín Chỉ Carbon Việt Nam.
          <br/>
          &copy; ${new Date().getFullYear()} Tín Chỉ Carbon Việt Nam. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </body>
    </html>
  `;
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
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Giá tiền:</span> ${formatCurrency(
                    product?.amount ?? 0,
                  )}</p>
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Họ tên:</span> ${
                    product.buyerName || "N/A"
                  }</p>
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Email:</span> ${
                    product.buyerEmail || "N/A"
                  }</p>
                  <p style="margin: 4px 0;"><span style="font-weight: 500;">Số điện thoại:</span> ${
                    product.buyerPhone || "N/A"
                  }</p>
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
