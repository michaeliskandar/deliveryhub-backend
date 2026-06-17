import { Router } from "express";
import shipmentRoutes from "../modules/shipments/shipments.routes.js";

const router = Router();

router.use("/shipments", shipmentRoutes);

export default router;
