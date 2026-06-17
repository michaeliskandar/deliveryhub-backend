import { Types } from 'mongoose';
import { NotificationType } from '../../database/models/Notification.model';

export interface CreateNotificationInput {
  userId: Types.ObjectId | string;
  type: NotificationType;
  title: string;
  message: string;
  relatedShipmentId?: Types.ObjectId | string;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}
