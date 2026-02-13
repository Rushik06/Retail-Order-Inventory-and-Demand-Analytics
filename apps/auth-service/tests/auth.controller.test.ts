import { AuthController } from '../src/controller/auth.controller.js';
import type { AuthService } from '../src/services/auth.service.js';
import type { Request, Response } from 'express';

describe('AuthController', () => {
  const mockService = {
    register: vi.fn(),
    login: vi.fn(),
  } as unknown as AuthService

  const controller = new AuthController(mockService);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  describe('register', () => {
    it('returns 201 when successful', async () => {
      const req = {
        body: {
            email: 'test@test.com', 
            password: '123456'
         },
      } as Request;

      const res = mockResponse();

      mockService.register = vi.fn().mockResolvedValue({ id: '1', email: 'test@test.com' });

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns 409 when email exists', async () => {
      const req = {
        body: { 
             email: 'dup@test.com',
             password: '123456' 
            },
      } as Request;

      const res = mockResponse();

      mockService.register = vi.fn().mockRejectedValue(new Error('EMAIL_TAKEN'));

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });
});