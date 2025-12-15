import mongoose from "mongoose";
import { config } from "./env";

/**
 * MongoDB Connection Options
 */
const mongooseOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10, // Số connection tối đa trong pool
  minPoolSize: 2, // Số connection tối thiểu
  serverSelectionTimeoutMS: 5000, // Timeout khi chọn server
  socketTimeoutMS: 45000, // Timeout cho socket
  retryWrites: true, // Tự động retry writes
};

/**
 * Retry configuration
 */
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Connect to MongoDB with retry logic
 */
const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    console.log(" Connecting to MongoDB...");

    await mongoose.connect(config.MONGO_URI, mongooseOptions);

    console.log(" MongoDB connected successfully");
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);

    // Connection event handlers
    mongoose.connection.on("error", (error) => {
      console.error(" MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(" MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log(" MongoDB reconnected");
    });
  } catch (error) {
    console.error(`MongoDB connection failed (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);

    if (retryCount < MAX_RETRIES - 1) {
      console.log(` Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    }

    console.error("Max retries reached. Exiting...");
    process.exit(1);
  }
};

/**
 * Graceful shutdown - đóng connection khi app shutdown
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed gracefully");
  } catch (error) {
    console.error(" Error closing MongoDB connection:", error);
  }
};

/**
 * Check if database is connected
 */
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export default connectDB;
