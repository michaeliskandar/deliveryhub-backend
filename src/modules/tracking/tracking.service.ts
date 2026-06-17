import { Tracking, ITracking } from '../../database/models/Tracking.model';
import { ApiError } from '../../shared/utils/ApiError';
import { getIO } from '../../config/socket';
import { createNotification } from '../notifications/notifications.service';
import {
  LocationPingInput,
  StatusUpdateInput,
  InitTrackingInput,
  STATUS_NOTIFICATION_COPY,
} from './tracking.types';

// Distance between two lat/lng points in kilometers (haversine formula)
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function computeProgress(tracking: ITracking, current: { lat: number; lng: number }): number {
  const totalDistance = distanceKm(tracking.pickupLocation, tracking.dropoffLocation);
  if (totalDistance === 0) return 100;

  const remaining = distanceKm(current, tracking.dropoffLocation);
  const traveled = totalDistance - remaining;
  const percent = (traveled / totalDistance) * 100;

  // Clamp — GPS noise or an off-route ping shouldn't produce >100% or negative values
  return Math.max(0, Math.min(100, Math.round(percent)));
}

/**
 * Called by the Shipments/Offers module once a captain is assigned and a
 * shipment moves from "offer accepted" into something trackable.
 */
export async function initTracking(input: InitTrackingInput): Promise<ITracking> {
  const existing = await Tracking.findOne({ shipmentId: input.shipmentId });
  if (existing) {
    throw ApiError.conflict('Tracking already initialized for this shipment');
  }

  const tracking = await Tracking.create({
    shipmentId: input.shipmentId,
    captainId: input.captainId,
    status: input.captainId ? 'assigned' : 'pending',
    pickupLocation: input.pickupLocation,
    dropoffLocation: input.dropoffLocation,
    estimatedArrival: input.estimatedArrival,
    milestones: [{ status: input.captainId ? 'assigned' : 'pending', timestamp: new Date() }],
  });

  return tracking;
}

export async function getTrackingByShipmentId(shipmentId: string): Promise<ITracking> {
  const tracking = await Tracking.findOne({ shipmentId }).populate('captainId', 'name phone avatarUrl');
  if (!tracking) {
    throw ApiError.notFound('No tracking record found for this shipment');
  }
  return tracking;
}

/**
 * Called when a GPS ping arrives — either from a real captain app or the
 * demo simulation script. Both hit this exact same function and endpoint,
 * so swapping the data source later requires zero backend changes.
 */
export async function recordLocationPing(
  shipmentId: string,
  captainId: string,
  ping: LocationPingInput
): Promise<ITracking> {
  const tracking = await Tracking.findOne({ shipmentId });
  if (!tracking) {
    throw ApiError.notFound('No tracking record found for this shipment');
  }

  if (tracking.captainId?.toString() !== captainId) {
    throw ApiError.forbidden('You are not the assigned captain for this shipment');
  }

  if (tracking.status === 'delivered' || tracking.status === 'cancelled') {
    throw ApiError.badRequest('Cannot update location on a closed shipment');
  }

  tracking.currentLocation = { lat: ping.lat, lng: ping.lng, updatedAt: new Date() };
  tracking.progressPercent = computeProgress(tracking, ping);

  // First location ping after assignment implicitly marks pickup
  if (tracking.status === 'assigned') {
    tracking.status = 'in_transit';
    tracking.milestones.push({ status: 'in_transit', timestamp: new Date() });
  }

  await tracking.save();

  // Real-time push to anyone watching this shipment's tracking page
  getIO().to(`shipment:${shipmentId}`).emit('locationUpdate', {
    shipmentId,
    lat: ping.lat,
    lng: ping.lng,
    progressPercent: tracking.progressPercent,
    updatedAt: tracking.currentLocation.updatedAt,
  });

  return tracking;
}

/**
 * Explicit status transitions (picked_up, delivered, cancelled, etc.) made by
 * the captain through the app UI — distinct from the implicit GPS-driven
 * in_transit transition above. This is also where notifications get fired.
 */
export async function updateStatus(
  shipmentId: string,
  captainId: string,
  input: StatusUpdateInput
): Promise<ITracking> {
  const tracking = await Tracking.findOne({ shipmentId });
  if (!tracking) {
    throw ApiError.notFound('No tracking record found for this shipment');
  }

  if (tracking.captainId?.toString() !== captainId) {
    throw ApiError.forbidden('You are not the assigned captain for this shipment');
  }

  const validTransitions: Record<string, string[]> = {
    pending: ['assigned', 'cancelled'],
    assigned: ['picked_up', 'cancelled'],
    picked_up: ['in_transit', 'cancelled'],
    in_transit: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
  };

  if (!validTransitions[tracking.status]?.includes(input.status)) {
    throw ApiError.badRequest(`Cannot move shipment from ${tracking.status} to ${input.status}`);
  }

  tracking.status = input.status;
  tracking.milestones.push({ status: input.status, timestamp: new Date(), note: input.note });

  if (input.status === 'delivered') {
    tracking.progressPercent = 100;
  }

  await tracking.save();

  getIO().to(`shipment:${shipmentId}`).emit('statusUpdate', {
    shipmentId,
    status: tracking.status,
    note: input.note,
    timestamp: new Date(),
  });

  // Fire the matching notification, if this status warrants one.
  // We need the customer's userId here — in a real wire-up this comes from
  // the Shipment document (shipment.customerId). Left as a TODO hook below
  // since Shipments is owned by another teammate.
  const copy = STATUS_NOTIFICATION_COPY[input.status];
  if (copy) {
    // TODO: replace with actual lookup once Shipments module exposes it,
    // e.g. const shipment = await getShipmentById(shipmentId); customerId = shipment.customerId
    const customerId = (tracking as unknown as { customerId?: string }).customerId;
    if (customerId) {
      await createNotification({
        userId: customerId,
        type: copy.type as never,
        title: copy.title,
        message: input.note || `${copy.title} for shipment ${shipmentId}.`,
        relatedShipmentId: shipmentId,
      });
    }
  }

  return tracking;
}
