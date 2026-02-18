/*eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProfileService } from '../src/services/profile.service.js';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new ProfileService(mockRepo);
  });

  it('should return user profile', async () => {
    mockRepo.findById.mockResolvedValue({
      id: '1',
      name: 'John',
      email: 'john@test.com',
      isActive: true,
    });

    const result = await service.getProfile('1');

    expect(result?.name).toBe('John');
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });

  it('should throw if user not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.getProfile('1')).rejects.toThrow('USER_NOT_FOUND');
  });

  it('should update profile', async () => {
    mockRepo.update.mockResolvedValue({
      id: '1',
      name: 'Updated',
      email: 'updated@test.com',
    });

    const result = await service.updateProfile('1', {
      name: 'Updated',
    });

    expect(result.name).toBe('Updated');
  });

  it('should delete profile', async () => {
    mockRepo.delete.mockResolvedValue(true);

    const result = await service.deleteProfile('1');

    expect(result).toEqual({ message: 'Account deleted successfully' });
  });
});