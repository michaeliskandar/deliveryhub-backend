import { User, IUser } from '../../database/models/User.model';
import { ApiError } from '../../shared/utils/ApiError';
import { UpdateProfileInput } from './users.types';

export async function getProfile(userId: string): Promise<IUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<IUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (input.name !== undefined) user.name = input.name;
  if (input.phone !== undefined) user.phone = input.phone;
  if (input.avatarUrl !== undefined) user.avatarUrl = input.avatarUrl;

  await user.save();
  return user;
}

export async function registerPushToken(userId: string, token: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $addToSet: { pushTokens: token } });
}

export async function removePushToken(userId: string, token: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $pull: { pushTokens: token } });
}

/**
 * Shared authorization helper — Tracking and Notifications import this instead
 * of querying the User collection directly. Keeping "who can see this user's
 * data" logic in one place means a future change to roles/permissions only
 * needs to happen here.
 *
 * NOTE: actual shipment ownership (is this customer's shipment, is this the
 * assigned captain, etc.) lives with the Shipments module — this only confirms
 * the user exists and returns their role so the caller can apply its own rule.
 */
export async function getUserRole(userId: string): Promise<string> {
  const user = await User.findById(userId).select('role');
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user.role;
}
