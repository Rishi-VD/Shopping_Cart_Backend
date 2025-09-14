import express from "express";
import { register, login, getUser, logout } from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";
const authRouter = express.Router()


authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/user", verifyToken, getUser)
authRouter.get("/logout", logout)

export default authRouter;