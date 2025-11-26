import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI read as:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "expensetrackerai",
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
