import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
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
    }),
  );
  app.get("/", (req, res) => {
    console.log("chay toi day");
    return;
  });
  app.use("/api/auth", authRouter);
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
  app.use(notFoundHandler);
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})();
