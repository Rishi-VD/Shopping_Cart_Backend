import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 1000, // 1 hour
};

const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        name = name.trim();
        email = email.trim().toLowerCase();

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Email already in use.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };

        return res.status(201).json({
            success: true,
            message: "Account created.",
            user: userResponse,
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment");
            return res.status(500).json({
                success: false,
                message: "Server configuration error.",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, cookieOptions);

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            cart: user.cart || [],
        };

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: userResponse,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", { ...cookieOptions, maxAge: 0 });

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("getUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

export { register, login, logout, getUser };
