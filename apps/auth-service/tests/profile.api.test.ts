/*eslint-disable*/ 
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileService } from '../src/services/profile.service.js';

describe('ProfileService', () => {
  let mockRepo: any;
  let service: ProfileService;

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new ProfileService(mockRepo);
  });


  // GET PROFILE
 
  it('should return profile successfully', async () => {
    mockRepo.findById.mockResolvedValue({
      id: '123',
      name: 'John Doe',
      email: 'john@test.com',
    });

    const result = await service.getProfile('123');

    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@test.com',
    });

    expect(mockRepo.findById).toHaveBeenCalledWith('123');
  });

  it('should throw USER_NOT_FOUND if user does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.getProfile('123'))
      .rejects
      .toThrow('USER_NOT_FOUND');
  });


  // UPDATE PROFILE


  it('should update profile successfully', async () => {
    mockRepo.findById.mockResolvedValue({
      id: '123',
      name: 'Old Name',
      email: 'john@test.com',
    });

    mockRepo.update.mockResolvedValue({
      id: '123',
      name: 'Updated Name',
      email: 'john@test.com',
    });

    const result = await service.updateProfile('123', {
      name: 'Updated Name',
    });

    expect(result.name).toBe('Updated Name');
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('should throw USER_NOT_FOUND when updating missing user', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(
      service.updateProfile('123', { name: 'Updated' })
    ).rejects.toThrow('USER_NOT_FOUND');
  });

 
  // DELETE PROFILE
  

  it('should delete account successfully', async () => {
    mockRepo.findById.mockResolvedValue({
      id: '123',
      name: 'John Doe',
      email: 'john@test.com',
    });

    mockRepo.delete.mockResolvedValue(true);

    const result = await service.deleteProfile('123');

    expect(result).toEqual({
      message: 'Account deleted successfully',
    });

    expect(mockRepo.delete).toHaveBeenCalledWith('123');
  });

  it('should throw USER_NOT_FOUND when deleting missing user', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.deleteProfile('123'))
      .rejects
      .toThrow('USER_NOT_FOUND');
  });
});