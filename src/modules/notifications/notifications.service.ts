import { Notification } from '../../database/models/Notification.model';
import { getIO } from '../../config/socket';
import { CreateNotificationInput, NotificationListQuery } from './notifications.types';
import { ApiError } from '../../shared/utils/ApiError';

/**
 * Internal function for other modules to call (shipments, offers, tracking, etc.)
 * This is the ONLY way a notification should be created — never call Notification.create()
 * directly from another module. Keeping this centralized means every notification
 * automatically gets persisted AND pushed in real time, with one code path to maintain.
 */
export async function createNotification(input: CreateNotificationInput) {
  const notification = await Notification.create({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    relatedShipmentId: input.relatedShipmentId,
    isRead: false,
  });

  // Push to whichever client(s) the user currently has open, if any.
  // If they're offline, it just sits in MongoDB until they fetch the feed.
  try {
    getIO().to(`user:${input.userId}`).emit('newNotification', notification);
  } catch {
    // Socket.IO not initialized (e.g. running in a script/job context) — safe to ignore.
  }

  return notification;
}

export async function getNotificationsForUser(userId: string, query: NotificationListQuery) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 50) : 20;

  const filter: Record<string, unknown> = { userId };
  if (query.unreadOnly) {
    filter.isRead = false;
  }

  const [items, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  return { items, total, page, limit };
}

export async function getUnreadCount(userId: string) {
  return Notification.countDocuments({ userId, isRead: false });
}

export async function markAsRead(userId: string, notificationId: string) {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }
  notification.isRead = true;
  await notification.save();
  return notification;
}

export async function markAllAsRead(userId: string) {
  await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
}
