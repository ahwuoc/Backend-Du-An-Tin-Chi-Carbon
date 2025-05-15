import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
import connectDB from "./config/db";
import productRouter from "./routes/products.router";
import consultationRouter from "./routes/consultation.router";
import orderRouter from "./routes/order.router";
import carbon from "./routes/carbon-product.router";
import donateTree from "./routes/donate-tree.router";
import authRouter from "./routes/auth.router";
import newsRouter from "./routes/news.router";
import projectRouter from "./routes/project.router";
import affiliateRouter from "./routes/affiliate.router";
import ProjectCarbonRouter from "./routes/project-carbon.router";
import "./models/users.model";
import "./models/news.model";
import "./models/affiliate.model";
import "./models/consultation";
import "./models/payment";
import "./models/donate.model";
import "./models/project.model";

import { notFoundHandler } from "./routes/notfound";
import { upload } from "./routes/upload.router";
const app = express();
app.post(
  "/upload-image",
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file?.filename}`;
    res.json({ url: imageUrl });
  }
);
app.use("/uploads", express.static("uploads"));
(async () => {
  await connectDB();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use("/api", authRouter);
  app.use("/api/consultation", consultationRouter);
  app.use("/api/projects", projectRouter);
  app.use("/api/projects", ProjectCarbonRouter);
  app.use("/api/carbons", carbon);
  app.use("/api/donation", donateTree);
  app.use("/api/orders", orderRouter);
  app.use("/api/products", productRouter);
  app.use("/api/affiliates", affiliateRouter);
  app.use("/api/news", newsRouter);
  app.use(notFoundHandler);
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})();
