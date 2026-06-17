import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as usersService from './users.service';
import { validateUpdateProfile, validatePushToken } from './users.validation';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.getProfile(req.user!.userId);
  return ApiResponse.success(res, user, 'Profile fetched');
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const input = validateUpdateProfile(req.body);
  const user = await usersService.updateProfile(req.user!.userId, input);
  return ApiResponse.success(res, user, 'Profile updated');
});

export const addPushToken = asyncHandler(async (req: Request, res: Response) => {
  const token = validatePushToken(req.body);
  await usersService.registerPushToken(req.user!.userId, token);
  return ApiResponse.success(res, null, 'Push token registered');
});

export const removePushToken = asyncHandler(async (req: Request, res: Response) => {
  const token = validatePushToken(req.body);
  await usersService.removePushToken(req.user!.userId, token);
  return ApiResponse.success(res, null, 'Push token removed');
});
