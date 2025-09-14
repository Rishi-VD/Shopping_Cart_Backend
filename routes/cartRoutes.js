import express from "express";
import { addToCart, removeFromCart, incrementQuantity, decrementQuantity, checkOut, clearCart } from "../controllers/cartController.js";
import verifyToken from "../middlewares/verifyToken.js";
const cartRouter = express.Router()


cartRouter.post("/add", verifyToken, addToCart)
cartRouter.delete("/remove/:id", verifyToken, removeFromCart)
cartRouter.post("/increment/:id", verifyToken, incrementQuantity)
cartRouter.post("/decrement/:id", verifyToken, decrementQuantity)
cartRouter.post("/checkout", verifyToken, checkOut)
cartRouter.get("/clear", verifyToken, clearCart)


export default cartRouter;