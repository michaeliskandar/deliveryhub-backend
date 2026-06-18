import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { authorize } from "../../shared/middleware/authorize.js";
import { validate } from "../../shared/middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import {
    shipmentIdParamSchema,
    locationPingSchema,
    statusUpdateSchema,
} from "./tracking.validation.js";
import { getTracking, postLocationPing, postStatusUpdate } from "./tracking.controller.js";

const router = Router();

router.use(authenticate);

// Customers, offices, and admins can view tracking for a shipment they're tied to.
// Fine-grained "is this YOUR shipment" ownership checks happen once the
// Shipments module exposes a reusable ownership lookup.
router.get("/:shipmentId", validate(shipmentIdParamSchema, "params"), getTracking);

// Only the assigned captain can push location pings or change status
router.post(
    "/:shipmentId/location",
    authorize(ROLES.CAPTAIN),
    validate(shipmentIdParamSchema, "params"),
    validate(locationPingSchema, "body"),
    postLocationPing
);

router.post(
    "/:shipmentId/status",
    authorize(ROLES.CAPTAIN),
    validate(shipmentIdParamSchema, "params"),
    validate(statusUpdateSchema, "body"),
    postStatusUpdate
);

export default router;
