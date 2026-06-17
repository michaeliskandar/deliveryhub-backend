import { ApiError } from '../../shared/utils/ApiError';

export function validateLocationPing(body: unknown): { lat: number; lng: number } {
  const { lat, lng } = body as { lat?: unknown; lng?: unknown };

  if (typeof lat !== 'number' || lat < -90 || lat > 90) {
    throw ApiError.badRequest('lat must be a number between -90 and 90');
  }
  if (typeof lng !== 'number' || lng < -180 || lng > 180) {
    throw ApiError.badRequest('lng must be a number between -180 and 180');
  }

  return { lat, lng };
}

const VALID_STATUSES = ['assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

export function validateStatusUpdate(body: unknown): { status: string; note?: string } {
  const { status, note } = body as { status?: unknown; note?: unknown };

  if (typeof status !== 'string' || !VALID_STATUSES.includes(status)) {
    throw ApiError.badRequest(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (note !== undefined && typeof note !== 'string') {
    throw ApiError.badRequest('note must be a string');
  }

  return { status, note: note as string | undefined };
}
