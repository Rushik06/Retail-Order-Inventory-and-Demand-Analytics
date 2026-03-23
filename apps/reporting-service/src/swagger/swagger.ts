import { setupSwagger } from '@repo/shared';
import type { Express } from 'express';

export const initSwagger = (app: Express) => {
  setupSwagger(app, {
    title: 'Reporting Service API',
    version: '1.0.0',
    description: 'Reporting Service Documentation',
    serverUrl: 'http://localhost',
    apis: process.env.NODE_ENV === 'production'
      ? ['./dist/**/*.js']
      : ['./src/**/*.ts']
  });
};