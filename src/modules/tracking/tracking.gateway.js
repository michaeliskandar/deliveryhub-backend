/**
 * Tracking module's real-time contract.
 *
 * The actual Socket.IO server is initialized once in src/config/socket.js
 * and shared across modules (Tracking, Notifications) so there's only one
 * socket server, not competing instances. This file documents the events
 * that belong to Tracking specifically.
 *
 * Client -> Server events:
 *   - 'joinShipment'  (shipmentId)  Join the room for live updates on one shipment
 *   - 'leaveShipment' (shipmentId)  Leave that room (e.g. navigating away)
 *
 * Server -> Client events (emitted from tracking.service.js):
 *   - 'locationUpdate' { shipmentId, coords: [lng, lat], progressPercent, updatedAt }
 *   - 'statusUpdate'   { shipmentId, status, note, timestamp }
 *
 * Room naming convention: `shipment:<shipmentId>`
 */

export { getIO } from "../../config/socket.js";
