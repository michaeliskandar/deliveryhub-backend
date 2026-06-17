import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';
import * as trackingController from './tracking.controller';

const router = Router();

router.use(authenticate);

// Customers, offices, and admins can all view tracking for a shipment they're tied to.
// Fine-grained "is this YOUR shipment" checks happen in the service layer once
// the Shipments module exposes an ownership lookup.
router.get('/:shipmentId', trackingController.getTracking);

// Only the assigned captain can push location pings or change status
router.post('/:shipmentId/location', authorize('captain'), trackingController.postLocationPing);
router.post('/:shipmentId/status', authorize('captain'), trackingController.postStatusUpdate);

export default router;
