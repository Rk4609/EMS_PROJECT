import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

// console.log("mongo", process.env.MONGODB_URI);
connectDB();
