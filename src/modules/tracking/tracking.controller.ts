import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as trackingService from './tracking.service';
import { validateLocationPing, validateStatusUpdate } from './tracking.validation';
import { ShipmentStatus } from '../../database/models/Tracking.model';

export const getTracking = asyncHandler(async (req: Request, res: Response) => {
  const tracking = await trackingService.getTrackingByShipmentId(req.params.shipmentId as string);
  return ApiResponse.success(res, tracking, 'Tracking info fetched');
});

export const postLocationPing = asyncHandler(async (req: Request, res: Response) => {
  const captainId = req.user!.userId;
  const ping = validateLocationPing(req.body);
  const tracking = await trackingService.recordLocationPing(req.params.shipmentId as string, captainId, ping);
  return ApiResponse.success(res, tracking, 'Location updated');
});

export const postStatusUpdate = asyncHandler(async (req: Request, res: Response) => {
  const captainId = req.user!.userId;
  const { status, note } = validateStatusUpdate(req.body);
  const tracking = await trackingService.updateStatus(req.params.shipmentId as string, captainId, {
    status: status as ShipmentStatus,
    note,
  });
  return ApiResponse.success(res, tracking, 'Status updated');
});
