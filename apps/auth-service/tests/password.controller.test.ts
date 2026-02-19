/*eslint-disable*/ 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../src/middleware/auth.middleware.js';
import { PasswordController } from '../src/controller/password.controller.js';
import type { PasswordService } from '../src/services/password.service.js';

describe('PasswordController', () => {
  let controller: PasswordController;
  let mockService: PasswordService;

  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockService = {
      changePassword: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
    } as unknown as PasswordService;

    controller = new PasswordController(mockService);

    mockReq = {
      body: {},
      user: { id: 'user-123' },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  
  // CHANGE PASSWORD
  
  describe('changePassword', () => {
    it('should return 200 on success', async () => {
      mockReq.body = {
        currentPassword: 'oldPass',
        newPassword: 'newPass',
      };

      (mockService.changePassword as any).mockResolvedValue({
        message: 'Password changed successfully',
      });

      await controller.changePassword(
        mockReq as AuthenticatedRequest,
        mockRes as Response
      );

      expect(mockService.changePassword).toHaveBeenCalledWith(
        'user-123',
        'oldPass',
        'newPass'
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password changed successfully',
      });
    });

    it('should return 400 on error', async () => {
      (mockService.changePassword as any).mockRejectedValue(
        new Error('INVALID_CURRENT_PASSWORD')
      );

      await controller.changePassword(
        mockReq as AuthenticatedRequest,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'INVALID_CURRENT_PASSWORD',
      });
    });
  });

  
  // FORGOT PASSWORD

  describe('forgotPassword', () => {
    it('should return 200 on success', async () => {
      mockReq.body = { email: 'test@example.com' };

      (mockService.forgotPassword as any).mockResolvedValue({
        message: 'OTP sent to registered email',
      });

      await controller.forgotPassword(
        mockReq as any,
        mockRes as Response
      );

      expect(mockService.forgotPassword).toHaveBeenCalledWith(
        'test@example.com'
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'OTP sent to registered email',
      });
    });

    it('should return 400 on error', async () => {
      (mockService.forgotPassword as any).mockRejectedValue(
        new Error('USER_NOT_FOUND')
      );

      await controller.forgotPassword(
        mockReq as any,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'USER_NOT_FOUND',
      });
    });
  });

  
  // RESET PASSWORD
  
  describe('resetPassword', () => {
    it('should return 200 on success', async () => {
      mockReq.body = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newPass',
      };

      (mockService.resetPassword as any).mockResolvedValue({
        message: 'Password reset successfully',
      });

      await controller.resetPassword(
        mockReq as any,
        mockRes as Response
      );

      expect(mockService.resetPassword).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'newPass'
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password reset successfully',
      });
    });

    it('should return 400 on error', async () => {
      (mockService.resetPassword as any).mockRejectedValue(
        new Error('INVALID_OTP')
      );

      await controller.resetPassword(
        mockReq as any,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'INVALID_OTP',
      });
    });
  });
});