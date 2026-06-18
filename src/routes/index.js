import { Router } from "express";
import shipmentRoutes from "../modules/shipments/shipments.routes.js";
import trackingRoutes from "../modules/tracking/tracking.routes.js";
import notificationRoutes from "../modules/notifications/notifications.routes.js";
import userRoutes from "../modules/users/users.routes.js";

const router = Router();

router.use("/shipments", shipmentRoutes);
router.use("/tracking", trackingRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", userRoutes);

export default router;
