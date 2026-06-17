import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType =
  | 'picked_up'
  | 'in_transit'
  | 'offer_accepted'
  | 'offers_received'
  | 'delivered'
  | 'cancelled'
  | 'dispute_opened'
  | 'wallet_credited';

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedShipmentId?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'picked_up',
        'in_transit',
        'offer_accepted',
        'offers_received',
        'delivered',
        'cancelled',
        'dispute_opened',
        'wallet_credited',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedShipmentId: { type: Schema.Types.ObjectId, ref: 'Shipment' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', notificationSchema);
