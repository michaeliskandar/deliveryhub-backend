import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import earningsRoutes from "../modules/earnings/earnings.routes.js";
import notificationRoutes from "../modules/notifications/notifications.routes.js";
import officeRoutes from "../modules/office/office.routes.js";
import officeProfileRoutes from "../modules/office/office-profile.routes.js";
import officeVerificationRoutes from "../modules/office/office-verification.routes.js";
import offersRoutes from "../modules/offers/offers.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import clientProfileRoutes from "../modules/client/client-profile.routes.js";
import clientVerificationRoutes from "../modules/client/client-verification.routes.js";
import captainProfileRoutes from "../modules/captain/captain-profile.routes.js";
import captainVerificationRoutes from "../modules/captain/captain-verification.routes.js";
import ratingsRoutes from "../modules/reviews/ratings.routes.js";
import reviewsRoutes from "../modules/reviews/reviews.routes.js";
import shipmentRoutes from "../modules/shipments/shipments.routes.js";
import supportRoutes from "../modules/support/support.routes.js";
import trackingRoutes from "../modules/tracking/tracking.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import walletRoutes from "../modules/wallet/wallet.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use(earningsRoutes);
router.use("/notifications", notificationRoutes);
router.use("/office", officeRoutes);
router.use("/offers", offersRoutes);
router.use("/profile", profileRoutes);
router.use(ratingsRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/support", supportRoutes);
router.use("/tracking", trackingRoutes);
router.use("/users", userRoutes);
router.use("/wallet", walletRoutes);

// --- Image upload features (Cloudinary): Profile Picture + Verification Documents ---
// Each dashboard (Client / Office / Captain) has its own isolated, role-guarded
// router. The Admin dashboard intentionally has no image-upload routes of its own;
// it only reviews submissions through the "/review" endpoint of each module below.
router.use("/client/profile", clientProfileRoutes);
router.use("/client/verification", clientVerificationRoutes);

router.use("/office/profile", officeProfileRoutes);
router.use("/office/verification", officeVerificationRoutes);

router.use("/captain/profile", captainProfileRoutes);
router.use("/captain/verification", captainVerificationRoutes);

export default router;
