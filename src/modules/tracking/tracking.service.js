import Tracking, { TRACKING_STATUS } from "../../database/models/Tracking.model.js";
import Shipment from "../../database/models/Shipment.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { getIO } from "../../config/socket.js";
import notificationsService from "../notifications/notifications.service.js";

// Distance between two [lng, lat] points in kilometers (haversine).
// Mirrors calcDistanceKm in shipments.service.js so both modules agree on geometry.
const distanceKm = ([lng1, lat1], [lng2, lat2]) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const computeProgress = (pickupCoords, deliveryCoords, currentCoords) => {
    const total = distanceKm(pickupCoords, deliveryCoords);
    if (total === 0) return 100;

    const remaining = distanceKm(currentCoords, deliveryCoords);
    const traveled = total - remaining;
    const percent = (traveled / total) * 100;

    return Math.max(0, Math.min(100, Math.round(percent)));
};

// Maps each status to notification copy. Centralized so adding a new
// status later is a one-line change instead of hunting through the service.
const STATUS_NOTIFICATION_COPY = {
    [TRACKING_STATUS.ASSIGNED]: { type: "offer_accepted", title: "Captain assigned" },
    [TRACKING_STATUS.PICKED_UP]: { type: "picked_up", title: "Package picked up!" },
    [TRACKING_STATUS.IN_TRANSIT]: { type: "in_transit", title: "On the way" },
    [TRACKING_STATUS.DELIVERED]: { type: "delivered", title: "Delivered" },
    [TRACKING_STATUS.CANCELLED]: { type: "cancelled", title: "Shipment cancelled" },
};

/**
 * Called once a captain is assigned to a shipment (typically from the
 * Offers module, right after an offer is accepted).
 */
const initTracking = async (shipmentId, captainId) => {
    const existing = await Tracking.findOne({ shipment: shipmentId });
    if (existing) {
        throw new ApiError(409, "Tracking already initialized for this shipment");
    }

    const tracking = await Tracking.create({
        shipment: shipmentId,
        captain: captainId,
        status: TRACKING_STATUS.ASSIGNED,
        milestones: [{ status: TRACKING_STATUS.ASSIGNED, timestamp: new Date() }],
    });

    return tracking;
};

const getTrackingByShipmentId = async (shipmentId) => {
    const tracking = await Tracking.findOne({ shipment: shipmentId })
        .populate("captain", "name phone avatarUrl")
        .populate("shipment", "pickupAddress deliveryAddress pickupCoords deliveryCoords customer");

    if (!tracking) {
        throw new ApiError(404, "No tracking record found for this shipment");
    }
    return tracking;
};

/**
 * Called when a GPS ping arrives — either from a real captain app or the
 * demo simulation script in scripts/simulateGps.js. Both hit this exact
 * function/endpoint, so switching data sources later needs zero backend changes.
 */
const recordLocationPing = async (shipmentId, captainId, { lng, lat }) => {
    const tracking = await Tracking.findOne({ shipment: shipmentId }).populate(
        "shipment",
        "pickupCoords deliveryCoords"
    );
    if (!tracking) throw new ApiError(404, "No tracking record found for this shipment");

    if (String(tracking.captain) !== String(captainId)) {
        throw new ApiError(403, "You are not the assigned captain for this shipment");
    }

    if ([TRACKING_STATUS.DELIVERED, TRACKING_STATUS.CANCELLED].includes(tracking.status)) {
        throw new ApiError(400, "Cannot update location on a closed shipment");
    }

    const currentCoords = [lng, lat];
    tracking.currentLocation = { coords: currentCoords, updatedAt: new Date() };
    tracking.progressPercent = computeProgress(
        tracking.shipment.pickupCoords,
        tracking.shipment.deliveryCoords,
        currentCoords
    );

    if (tracking.status === TRACKING_STATUS.ASSIGNED) {
        tracking.status = TRACKING_STATUS.IN_TRANSIT;
        tracking.milestones.push({ status: TRACKING_STATUS.IN_TRANSIT, timestamp: new Date() });
    }

    await tracking.save();

    getIO().to(`shipment:${shipmentId}`).emit("locationUpdate", {
        shipmentId,
        coords: currentCoords,
        progressPercent: tracking.progressPercent,
        updatedAt: tracking.currentLocation.updatedAt,
    });

    return tracking;
};

/**
 * Explicit status transitions made by the captain (picked_up, delivered,
 * cancelled, etc.) — distinct from the implicit GPS-driven in_transit
 * transition above. This is where notifications fire.
 */
const updateStatus = async (shipmentId, captainId, { status, note }) => {
    const tracking = await Tracking.findOne({ shipment: shipmentId });
    if (!tracking) throw new ApiError(404, "No tracking record found for this shipment");

    if (String(tracking.captain) !== String(captainId)) {
        throw new ApiError(403, "You are not the assigned captain for this shipment");
    }

    const validTransitions = {
        [TRACKING_STATUS.ASSIGNED]: [TRACKING_STATUS.PICKED_UP, TRACKING_STATUS.CANCELLED],
        [TRACKING_STATUS.PICKED_UP]: [TRACKING_STATUS.IN_TRANSIT, TRACKING_STATUS.CANCELLED],
        [TRACKING_STATUS.IN_TRANSIT]: [TRACKING_STATUS.DELIVERED, TRACKING_STATUS.CANCELLED],
        [TRACKING_STATUS.DELIVERED]: [],
        [TRACKING_STATUS.CANCELLED]: [],
    };

    if (!validTransitions[tracking.status]?.includes(status)) {
        throw new ApiError(400, `Cannot move shipment from ${tracking.status} to ${status}`);
    }

    tracking.status = status;
    tracking.milestones.push({ status, timestamp: new Date(), note });

    if (status === TRACKING_STATUS.DELIVERED) {
        tracking.progressPercent = 100;
    }

    await tracking.save();

    getIO().to(`shipment:${shipmentId}`).emit("statusUpdate", {
        shipmentId,
        status,
        note,
        timestamp: new Date(),
    });

    const copy = STATUS_NOTIFICATION_COPY[status];
    if (copy) {
        const shipment = await Shipment.findById(shipmentId).select("customer");
        if (shipment?.customer) {
            await notificationsService.createNotification({
                userId: shipment.customer,
                type: copy.type,
                title: copy.title,
                message: note || `${copy.title} for your shipment.`,
                relatedShipmentId: shipmentId,
            });
        }
    }

    return tracking;
};

export default {
    initTracking,
    getTrackingByShipmentId,
    recordLocationPing,
    updateStatus,
};
