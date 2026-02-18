import { describe, it, expect, vi } from 'vitest';
import { ProfileController } from '../src/controller/profile.controller.js';

describe('ProfileController', () => {
  const mockService = {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    deleteProfile: vi.fn(),
  };

  const controller = new ProfileController(mockService as any);

  const mockRes = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  it('should return profile', async () => {
    const req: any = { user: { id: '1' } };
    const res = mockRes();

    mockService.getProfile.mockResolvedValue({
      id: '1',
      name: 'John',
    });

    await controller.getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should update profile', async () => {
    const req: any = {
      user: { id: '1' },
      body: { name: 'Updated' },
    };
    const res = mockRes();

    mockService.updateProfile.mockResolvedValue({
      id: '1',
      name: 'Updated',
    });

    await controller.updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should delete profile', async () => {
    const req: any = { user: { id: '1' } };
    const res = mockRes();

    mockService.deleteProfile.mockResolvedValue(true);

    await controller.deleteProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});