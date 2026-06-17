import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { errorHandler } from './shared/middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api', routes);

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
}
