import { Schema, model, Document, Types } from 'mongoose';

export type ShipmentStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface IMilestone {
  status: ShipmentStatus;
  timestamp: Date;
  note?: string;
}

export interface ILocation {
  lat: number;
  lng: number;
  updatedAt: Date;
}

export interface ITracking extends Document {
  _id: Types.ObjectId;
  shipmentId: Types.ObjectId;
  captainId?: Types.ObjectId;
  status: ShipmentStatus;
  currentLocation?: ILocation;
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  milestones: IMilestone[];
  estimatedArrival?: Date;
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const milestoneSchema = new Schema<IMilestone>(
  {
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const trackingSchema = new Schema<ITracking>(
  {
    shipmentId: { type: Schema.Types.ObjectId, ref: 'Shipment', required: true, unique: true },
    captainId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    currentLocation: { type: locationSchema },
    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoffLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    milestones: { type: [milestoneSchema], default: [] },
    estimatedArrival: { type: Date },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

trackingSchema.index({ shipmentId: 1 });
trackingSchema.index({ captainId: 1, status: 1 });

export const Tracking = model<ITracking>('Tracking', trackingSchema);
