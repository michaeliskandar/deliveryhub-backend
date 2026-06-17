import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as notificationsService from './notifications.service';

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const unreadOnly = req.query.unreadOnly === 'true';

  const { items, total } = await notificationsService.getNotificationsForUser(userId, {
    page,
    limit,
    unreadOnly,
  });

  return ApiResponse.paginated(res, items, total, page, limit, 'Notifications fetched');
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const count = await notificationsService.getUnreadCount(userId);
  return ApiResponse.success(res, { count }, 'Unread count fetched');
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const notification = await notificationsService.markAsRead(userId, req.params.id as string);
  return ApiResponse.success(res, notification, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await notificationsService.markAllAsRead(userId);
  return ApiResponse.success(res, null, 'All notifications marked as read');
});
