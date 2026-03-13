import express from 'express';
import type { Express } from 'express';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import passwordRoutes from './routes/password.routes.js';
import rbacRoutes from './routes/rbac.routes.js';
import cors from 'cors';
import { setupSwagger } from './swagger/swaggers.js';

const app: Express = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Auth
app.use('/api/auth', authRoutes);

// Profile
app.use('/api/profile', profileRoutes);

// Password
app.use('/api/password', passwordRoutes);

// RBAC
app.use('/api/rbac', rbacRoutes);

setupSwagger(app);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'auth-service',
  });
});

export default app;