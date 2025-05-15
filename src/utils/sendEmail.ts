import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<{ success: boolean; error?: string }> => {
  // Validate email cơ bản
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    console.error(`Invalid email address: ${to}`);
    return { success: false, error: "Email không hợp lệ" };
  }

  try {
    console.log(`Sending email to: ${to}, subject: ${subject}`);
    await transporter.sendMail({
      from: process.env.SMTP_NAME,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to: ${to}`);
    return { success: true };
  } catch (err: any) {
    console.error(`Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};
