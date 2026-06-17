import { ShipmentStatus } from '../../database/models/Tracking.model';

export interface LocationPingInput {
  lat: number;
  lng: number;
}

export interface StatusUpdateInput {
  status: ShipmentStatus;
  note?: string;
}

export interface InitTrackingInput {
  shipmentId: string;
  captainId?: string;
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  estimatedArrival?: Date;
}

// Maps each status to the notification copy shown in the feed.
// Centralizing this means adding a new status later is a one-line change.
export const STATUS_NOTIFICATION_COPY: Record<
  ShipmentStatus,
  { type: string; title: string } | null
> = {
  pending: null,
  assigned: { type: 'offer_accepted', title: 'Captain assigned' },
  picked_up: { type: 'picked_up', title: 'Package picked up!' },
  in_transit: { type: 'in_transit', title: 'On the way' },
  delivered: { type: 'delivered', title: 'Delivered' },
  cancelled: { type: 'cancelled', title: 'Shipment cancelled' },
};
