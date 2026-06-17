/**
 * Tracking module's real-time contract.
 *
 * The actual Socket.IO server instance is initialized once in
 * src/config/socket.ts and shared across all modules (Tracking,
 * Notifications, etc.) so we don't end up with multiple competing
 * socket servers. This file documents and re-exports the events that
 * belong to Tracking specifically, so anyone reading this module knows
 * the full real-time contract without digging through config/.
 *
 * Client -> Server events:
 *   - 'joinShipment'  (shipmentId: string)  Join the room for live updates on one shipment
 *   - 'leaveShipment' (shipmentId: string)  Leave that room (e.g. navigating away from the page)
 *
 * Server -> Client events (emitted from tracking.service.ts):
 *   - 'locationUpdate' { shipmentId, lat, lng, progressPercent, updatedAt }
 *   - 'statusUpdate'   { shipmentId, status, note, timestamp }
 *
 * Room naming convention: `shipment:<shipmentId>`
 */

export { getIO } from '../../config/socket';
