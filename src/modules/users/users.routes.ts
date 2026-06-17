import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import * as usersController from './users.controller';

const router = Router();

router.use(authenticate);

router.get('/me', usersController.getMe);
router.patch('/me', usersController.updateMe);
router.post('/push-token', usersController.addPushToken);
router.delete('/push-token', usersController.removePushToken);

export default router;
