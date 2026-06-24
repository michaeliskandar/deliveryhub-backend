import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import notificationRoutes from "../modules/notifications/notifications.routes.js";
import offersRoutes from "../modules/offers/offers.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import reviewsRoutes from "../modules/reviews/reviews.routes.js";
import shipmentRoutes from "../modules/shipments/shipments.routes.js";
import supportRoutes from "../modules/support/support.routes.js";
import trackingRoutes from "../modules/tracking/tracking.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import walletRoutes from "../modules/wallet/wallet.routes.js";
import adminUsersRoutes from "../modules/admin/users/Admin.users.routes.js";
import settingsRoutes from "../modules/admin/setting/Settings.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/notifications", notificationRoutes);
router.use("/offers", offersRoutes);
router.use("/profile", profileRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/support", supportRoutes);
router.use("/tracking", trackingRoutes);
router.use("/users", userRoutes);
router.use("/wallet", walletRoutes);
router.use("/admin/users", adminUsersRoutes);
router.use("/admin/setting", settingsRoutes);

export default router;
