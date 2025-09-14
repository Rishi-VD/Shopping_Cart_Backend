import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

dotenv.config();

const app = express();
const databaseURL = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://shopping-cart-mernstack.netlify.app",
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(databaseURL);
        isConnected = true;
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    }
};

connectDB();

export default app;
