import { Schema, model } from "mongoose";

// Mirrors the kind of statuses shipments.service.js already deals with
// (SHIPMENT_STATUS.PENDING_OFFERS, CAPTAIN_ASSIGNMENT, etc.) plus the
// physical-movement statuses this module owns. If shared/constants/shipmentStatus.js
// already defines these, swap this local list for that import instead.
export const TRACKING_STATUS = {
    ASSIGNED: "assigned",
    PICKED_UP: "picked_up",
    IN_TRANSIT: "in_transit",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
};

const milestoneSchema = new Schema(
    {
        status: { type: String, enum: Object.values(TRACKING_STATUS), required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
    },
    { _id: false }
);

const trackingSchema = new Schema(
    {
        shipment: { type: Schema.Types.ObjectId, ref: "Shipment", required: true, unique: true },
        captain: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: Object.values(TRACKING_STATUS),
            default: TRACKING_STATUS.ASSIGNED,
        },
        // [lng, lat] to match pickupCoords/deliveryCoords convention used in shipments.service.js
        currentLocation: {
            coords: { type: [Number] }, // [lng, lat]
            updatedAt: { type: Date },
        },
        milestones: { type: [milestoneSchema], default: [] },
        estimatedArrival: { type: Date },
        progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    },
    { timestamps: true }
);

trackingSchema.index({ captain: 1, status: 1 });

export default model("Tracking", trackingSchema);
