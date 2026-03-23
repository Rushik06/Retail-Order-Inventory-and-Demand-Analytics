import { setupSwagger } from '@repo/shared';
import type { Express } from 'express';

export const initSwagger = (app: Express) => {
  setupSwagger(app, {
    title: 'Inventory Service API',
    version: '1.0.0',
    description: 'Inventory Service Documentation',
    serverUrl: 'http://localhost',
    apis: process.env.NODE_ENV === 'production'
      ? ['./dist/**/*.js']
      : ['./src/**/*.ts']
  });
};