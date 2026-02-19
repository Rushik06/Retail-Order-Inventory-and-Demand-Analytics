/*eslint-disable*/ 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { PasswordService } from '../src/services/password.service.js';
import { PasswordRepository } from '../src/repository/password.repository.js';

// MOCK bcrypt 
vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

//  MOCK EmailService 
vi.mock('../src/services/email.service.js', () => ({
  EmailService: vi.fn().mockImplementation(() => ({
    sendOtpEmail: vi.fn().mockResolvedValue(true),
  })),
}));

// MOCK crypto randomInt
vi.mock('crypto', () => ({
  randomInt: vi.fn(() => 123456),
}));

describe('PasswordService', () => {
  let repo: PasswordRepository;
  let service: PasswordService;

  const mockUser = {
    getDataValue: vi.fn((key: string) => {
      const values: Record<string, any> = {
        user_id: 'user-123',
        email: 'test@mail.com',
        password: 'hashed-password',
      };
      return values[key];
    }),
  };

  const mockOtp = {
    getDataValue: vi.fn((key: string) => {
      const values: Record<string, any> = {
        id: 'otp-1',
        expires_at: new Date(Date.now() + 600000),
      };
      return values[key];
    }),
  };

  beforeEach(() => {
    repo = {
      findUserById: vi.fn(),
      updatePassword: vi.fn(),
      createOtp: vi.fn(),
      findValidOtp: vi.fn(),
      markOtpUsed: vi.fn(),
    } as unknown as PasswordRepository;

    service = new PasswordService(repo);
    vi.clearAllMocks();
  });

 
  // CHANGE PASSWORD
 

  it('should change password successfully', async () => {
    (repo.findUserByEmail as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true);
    (bcrypt.hash as any).mockResolvedValue('new-hash');

    const result = await service.changePassword(
      'user-123',
      'oldpass',
      'newpass'
    );

    expect(repo.updatePassword).toHaveBeenCalledWith(
      'user-123',
      'new-hash'
    );

    expect(result.message).toBe('Password changed successfully');
  });

  it('should throw if user not found', async () => {
    (repo.findUserByEmail as any).mockResolvedValue(null);

    await expect(
      service.changePassword('id', 'a', 'b')
    ).rejects.toThrow('USER_NOT_FOUND');
  });

  it('should throw if current password invalid', async () => {
    (repo.findUserByEmail as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(
      service.changePassword('id', 'wrong', 'new')
    ).rejects.toThrow('INVALID_CURRENT_PASSWORD');
  });

  
  // FORGOT PASSWORD


  it('should generate OTP and send email', async () => {
    (repo.findUserByEmail as any).mockResolvedValue(mockUser);

    const result = await service.forgotPassword('test@mail.com');

    expect(repo.createOtp).toHaveBeenCalled();
    expect(result.message).toBe('OTP sent to registered email');
  });

  it('should throw if forgot password user not found', async () => {
    (repo.findUserByEmail as any).mockResolvedValue(null);

    await expect(
      service.forgotPassword('wrong@mail.com')
    ).rejects.toThrow('USER_NOT_FOUND');
  });

  // RESET PASSWORD

  it('should reset password successfully', async () => {
    (repo.findUserByEmail as any).mockResolvedValue(mockUser);
    (repo.findValidOtp as any).mockResolvedValue(mockOtp);
    (bcrypt.hash as any).mockResolvedValue('new-hash');

    const result = await service.resetPassword(
      'test@mail.com',
      '123456',
      'newpass'
    );

    expect(repo.updatePassword).toHaveBeenCalled();
    expect(repo.markOtpUsed).toHaveBeenCalledWith('otp-1');
    expect(result.message).toBe('Password reset successfully');
  });

  it('should throw if OTP invalid', async () => {
    (repo.findUserByEmail as any).mockResolvedValue(mockUser);
    (repo.findValidOtp as any).mockResolvedValue(null);

    await expect(
      service.resetPassword('test@mail.com', '000000', 'new')
    ).rejects.toThrow('INVALID_OTP');
  });

  it('should throw if OTP expired', async () => {
    const expiredOtp = {
      getDataValue: vi.fn((key: string) => {
        const values: Record<string, any> = {
          id: 'otp-1',
          expires_at: new Date(Date.now() - 1000),
        };
        return values[key];
      }),
    };

    (repo.findUserByEmail as any).mockResolvedValue(mockUser);
    (repo.findValidOtp as any).mockResolvedValue(expiredOtp);

    await expect(
      service.resetPassword('test@mail.com', '123456', 'new')
    ).rejects.toThrow('OTP_EXPIRED');
  });
});