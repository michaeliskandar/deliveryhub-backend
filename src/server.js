import http from "http";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import { initSocket } from "./config/socket.js";
import { ENV } from "./config/env.js";

const start = async () => {
    await connectDB();

    const httpServer = http.createServer(app);

    initSocket(httpServer);
    console.log("Socket.IO initialized");

    httpServer.listen(ENV.PORT, () => {
        console.log(`Server running on port ${ENV.PORT}`);
    });
};

start();
