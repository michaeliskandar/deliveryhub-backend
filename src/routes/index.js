import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import { Router } from "express";
import shipmentRoutes from "../modules/shipments/shipments.routes.js";
import trackingRoutes from "../modules/tracking/tracking.routes.js";
import notificationRoutes from "../modules/notifications/notifications.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import supportRoutes from "../modules/support/support.routes.js";
import walletRoutes from "../modules/wallet/wallet.routes.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/tracking", trackingRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", userRoutes);

router.use("/support", supportRoutes);
router.use("/wallet", walletRoutes);
export default router;