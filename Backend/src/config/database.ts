import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/rewear";

    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options that are now defaults in Mongoose 6+
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.log("⚠️  MongoDB connection failed - API will work with mock data");
    isConnected = false;
    // Don't exit the process, let the app continue with mock data
  }
};

export const isDBConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};
