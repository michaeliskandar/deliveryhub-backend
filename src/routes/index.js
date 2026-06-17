import { Router } from "express";
// import authRoutes from "../modules/auth/auth.routes.js";
import profileRoutes from "../modules/profile/profile.router.js";

const router = Router();

// router.use("/auth", authRoutes);
router.use("/users", profileRoutes);

export default router;
