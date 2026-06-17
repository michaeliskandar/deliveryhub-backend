import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import * as notificationsController from './notifications.controller';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.getMyNotifications);
router.get('/unread-count', notificationsController.getUnreadCount);
router.patch('/read-all', notificationsController.markAllAsRead);
router.patch('/:id/read', notificationsController.markAsRead);

export default router;
