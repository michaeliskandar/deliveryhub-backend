import { ApiError } from '../../shared/utils/ApiError';
import { UpdateProfileInput } from './users.types';

export function validateUpdateProfile(body: unknown): UpdateProfileInput {
  const { name, phone, avatarUrl } = body as Record<string, unknown>;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    throw ApiError.badRequest('name must be a non-empty string');
  }
  if (phone !== undefined && typeof phone !== 'string') {
    throw ApiError.badRequest('phone must be a string');
  }
  if (avatarUrl !== undefined && typeof avatarUrl !== 'string') {
    throw ApiError.badRequest('avatarUrl must be a string');
  }

  return {
    name: name as string | undefined,
    phone: phone as string | undefined,
    avatarUrl: avatarUrl as string | undefined,
  };
}

export function validatePushToken(body: unknown): string {
  const { token } = body as Record<string, unknown>;
  if (typeof token !== 'string' || token.trim().length === 0) {
    throw ApiError.badRequest('token must be a non-empty string');
  }
  return token;
}
