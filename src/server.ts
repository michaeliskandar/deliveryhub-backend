import 'dotenv/config';
import http from 'http';
import mongoose from 'mongoose';
import { createApp } from './app';
import { initSocket } from './config/socket';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/deliverhub';

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  const app = createApp();
  const httpServer = http.createServer(app);

  initSocket(httpServer);
  console.log('Socket.IO initialized');

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
