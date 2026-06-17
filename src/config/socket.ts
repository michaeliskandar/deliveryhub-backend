import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../shared/middleware/authenticate';

let io: Server;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authenticate the socket connection itself using the same JWT used for REST
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error('Authentication token missing'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
      socket.data.user = decoded;
      return next();
    } catch {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as AuthPayload;

    // Every authenticated user automatically joins their own private room.
    // Notifications are emitted to `user:<id>` regardless of which page they're on.
    socket.join(`user:${user.userId}`);

    // A client explicitly joins a shipment room when it opens the tracking page
    // for that specific shipment (e.g. socket.emit('joinShipment', 'SC-00412'))
    socket.on('joinShipment', (shipmentId: string) => {
      socket.join(`shipment:${shipmentId}`);
    });

    socket.on('leaveShipment', (shipmentId: string) => {
      socket.leave(`shipment:${shipmentId}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocket() first.');
  }
  return io;
}
