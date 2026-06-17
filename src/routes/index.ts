import { Router } from 'express';
import usersRoutes from '../modules/users/users.routes';
import trackingRoutes from '../modules/tracking/tracking.routes';
import notificationsRoutes from '../modules/notifications/notifications.routes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/tracking', trackingRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
