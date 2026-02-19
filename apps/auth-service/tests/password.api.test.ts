/*eslint-disable*/ 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

//MOCK AUTH MIDDLEWARE
vi.mock('../src/middleware/auth.middleware.js', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { id: 'user-123' };
    next();
  },
}));

//MOCK VALIDATE MIDDLEWARE
vi.mock('../src/middleware/validate.middleware.js', () => ({
  validate: () => (_req: any, _res: any, next: any) => next(),
}));

// MOCK PASSWORD SERVICE
const mockService = {
  changePassword: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
};

vi.mock('../src/services/password.service.js', () => ({
  PasswordService: vi.fn().mockImplementation(() => mockService),
}));

// import after mocks
import passwordRoutes from '../src/routes/password.routes.js';

describe('Password Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/password', passwordRoutes);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('PATCH /change - success', async () => {
    mockService.changePassword.mockResolvedValue({
      message: 'Password changed successfully',
    });

    const res = await request(app)
      .patch('/api/password/change')
      .set('Authorization', 'Bearer token')
      .send({
        currentPassword: 'old',
        newPassword: 'new',
      });

    expect(res.status).toBe(200);
  });

  it('POST /forgot - success', async () => {
    mockService.forgotPassword.mockResolvedValue({
      message: 'OTP sent to registered email',
    });

    const res = await request(app)
      .post('/api/password/forgot')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(200);
  });

  it('PATCH /reset - success', async () => {
    mockService.resetPassword.mockResolvedValue({
      message: 'Password reset successfully',
    });

    const res = await request(app)
      .patch('/api/password/reset')
      .send({
        email: 'test@test.com',
        otp: '123456',
        newPassword: 'newpass',
      });

    expect(res.status).toBe(200);
  });
});