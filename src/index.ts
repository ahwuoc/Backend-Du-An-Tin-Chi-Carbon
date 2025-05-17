// Import thư viện cần thiết
import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
// Load biến môi trường từ file .env
dotenv.config();

// Import các route
import productRouter from "./routes/products.router";
import consultationRouter from "./routes/consultation.router";
import orderRouter from "./routes/order.router";
import connectDB from "./config/db";
import carbon from "./routes/carbon-product.router";
import donateTree from "./routes/donate-tree.router";
import authRouter from "./routes/auth.router";
import newsRouter from "./routes/news.router";
import projectRouter from "./routes/project.router";
import affiliateRouter from "./routes/affiliate.router";
import ProjectCarbonRouter from "./routes/project-carbon.router";
import affiliatepaymethodRouter from "./routes/affiliate-paymethod.router";
import affiliatransactionRouter from "./routes/affiliate-transaction.router";
import certificatesRouter from "./routes/certificate.router";
import creditcarbonRouter from "./routes/credit-carbon.router";

// Import models (chỉ cần gọi để khởi tạo)
import "./models/users.model";
import "./models/news.model";
import "./models/affiliate.model";
import "./models/consultation";
import "./models/payment";
import "./models/donate.model";
import "./models/project.model";

// Middleware và route cho xử lý lỗi 404
import { notFoundHandler } from "./routes/notfound";
const allowedOrigins = [
  "http://localhost:3000",
  "fe-theta-orcin.vercel.app",
  "fe-git-master-ahwuocs-projects.vercel.app",
  "fe-98au18ipf-ahwuocs-projects.vercel.app",
];

const app = express();
app.use(express.json());
app.set("trust proxy", 1);
(async () => {
  await connectDB();
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Middleware log tất cả request
  app.use((req, res, next) => {
    console.log(`\n[Request] ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    if (["POST", "PUT"].includes(req.method)) {
      console.log("Body:", req.body);
    }
    next();
  });

  // Đăng ký các router
  app.use("/api", authRouter);
  app.use("/api/consultation", consultationRouter);
  app.use("/api/projects", projectRouter);
  app.use("/api/project-carbons", ProjectCarbonRouter);
  app.use("/api/carbons", carbon);
  app.use("/api/donation", donateTree);
  app.use("/api/orders", orderRouter);
  app.use("/api/products", productRouter);
  app.use("/api/affiliates", affiliateRouter);
  app.use("/api/payment-method", affiliatepaymethodRouter);
  app.use("/api/transactions", affiliatransactionRouter);
  app.use("/api/certificates", certificatesRouter);
  app.use("/api/carboncredits", creditcarbonRouter);
  app.use("/api/news", newsRouter);

  // Middleware xử lý route không tồn tại
  app.use(notFoundHandler);

  // Start server
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})();
