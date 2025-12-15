import express, { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

// Load environment variables first
dotenv.config();

// Config
import { config, validateConfig } from "./config/env";
import connectDB, { disconnectDB } from "./config/db";
import { specs } from "./config/swagger";

// Middleware
import { errorHandle } from "./middleware";

// Routes - Clean imports from barrel
import {
  authRouter,
  consultationRouter,
  orderRouter,
  productRouter,
  newsRouter,
  projectRouter,
  affiliateRouter,
  projectCarbonRouter,
  affiliatePaymethodRouter,
  affiliateTransactionRouter,
  certificateRouter,
  creditCarbonRouter,
  carbonProductRouter,
  donateTreeRouter,
  notFoundHandler,
} from "./routes";

// Validate environment variables
validateConfig();

// Environment variables
const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

// CORS configuration
const corsOptions = {
  origin: config.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Trust proxy
app.set("trust proxy", 1);

// CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ==================== ROUTES ====================

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Tin Chi Carbon API is running",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Tin Chi Carbon API Documentation",
  })
);

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

// Global error handler (must be last)
app.use(errorHandle);

// ==================== SERVER ====================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// ==================== GRACEFUL SHUTDOWN ====================

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  await disconnectDB();
  console.log("✅ Graceful shutdown completed");
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (err: Error) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  gracefulShutdown("unhandledRejection");
});

process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});

// Start the server
startServer();
