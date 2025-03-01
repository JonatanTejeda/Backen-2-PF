import { authorizations } from "../middlewares/authorization.middleware.js";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";
import productRoutes from "./product.routes.js";
import { Router } from "express";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cart", authorizations(["user"]), cartRoutes);
router.use("/products", productRoutes);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", details: err.message });
});

export default router;