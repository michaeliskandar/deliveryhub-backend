import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import User from "../database/models/User.model.js";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: ENV.CLIENT_ORIGIN,
            methods: ["GET", "POST"],
        },
    });

    // Authenticate the socket connection using the same JWT used for REST
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Authentication token missing"));
            }

            const decoded = jwt.verify(token, ENV.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-passwordHash");
            if (!user) {
                return next(new Error("User no longer exists"));
            }

            socket.user = user;
            return next();
        } catch {
            return next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", (socket) => {
        // Every authenticated user joins their own private room automatically.
        // Notifications are emitted here regardless of which page the user is on.
        socket.join(`user:${socket.user._id}`);

        // Client explicitly joins a shipment room when opening that shipment's
        // tracking page, e.g. socket.emit('joinShipment', shipmentId)
        socket.on("joinShipment", (shipmentId) => {
            socket.join(`shipment:${shipmentId}`);
        });

        socket.on("leaveShipment", (shipmentId) => {
            socket.leave(`shipment:${shipmentId}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized. Call initSocket() first.");
    }
    return io;
};
