import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';

// Load environment variables
dotenv.config();

// Database connection
import connectDB from "./config/db";

// Swagger documentation
import { specs } from "./config/swagger";

// Import routes
import authRouter from "./routes/auth.router";
import consultationRouter from "./routes/consultation.router";
import orderRouter from "./routes/order.router";
import productRouter from "./routes/products.router";
import newsRouter from "./routes/news.router";
import projectRouter from "./routes/project.router";
import affiliateRouter from "./routes/affiliate.router";
import projectCarbonRouter from "./routes/project-carbon.router";
import affiliatePaymethodRouter from "./routes/affiliate-paymethod.router";
import affiliateTransactionRouter from "./routes/affiliate-transaction.router";
import certificateRouter from "./routes/certificate.router";
import creditCarbonRouter from "./routes/credit-carbon.router";
import carbonProductRouter from "./routes/carbon-product.router";
import donateTreeRouter from "./routes/donate-tree.router";
import { notFoundHandler } from "./routes/notfound.router";

// Environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// CORS configuration - Allow all origins
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

// CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Add headers middleware
app.use((req: Request, res: Response, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Tin Chi Carbon API is running",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Tin Chi Carbon API Documentation'
}));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/consultation", consultationRouter);
app.use("/api/projects", projectRouter);
app.use("/api/project-carbons", projectCarbonRouter);
app.use("/api/carbons", carbonProductRouter);
app.use("/api/donation", donateTreeRouter);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/affiliates", affiliateRouter);
app.use("/api/payment-method", affiliatePaymethodRouter);
app.use("/api/transactions", affiliateTransactionRouter);
app.use("/api/certificates", certificateRouter);
app.use("/api/carboncredits", creditCarbonRouter);
app.use("/api/news", newsRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Database connected successfully");

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Started at: ${new Date().toISOString()}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start the server
startServer();
