import express from 'express';
import type { Express } from 'express';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/auth.routes.js';
import { setupSwagger } from './swagger/swaggers.js';


const app:Express  = express();
app.use(express.json());

app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);

setupSwagger(app);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'auth-service'
  });
});

export default app;