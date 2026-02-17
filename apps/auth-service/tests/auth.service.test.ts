import { AuthService } from '../src/services/auth.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//  Mock bcrypt
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));
type Mockrepo ={
    findByEmail:ReturnType<typeof vi.fn>
    create:ReturnType<typeof vi.fn>
}

describe('AuthService', () => {
  let service: AuthService;
  let mockRepo:Mockrepo;
  

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepo = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };

    service = new AuthService(mockRepo as never);
  });

 
  // REGISTER TESTS
  

  it('should register a new user successfully', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    (bcrypt.hash as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      'hashed_password'
    );

    mockRepo.create.mockResolvedValue({
      id: '123',
      email: 'test@test.com',
      password: 'hashed_password',
      role: 'staff',
      isActive: true,
    });

    const result = await service.register({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result).toEqual({
      id: '123',
      email: 'test@test.com',
      role: 'staff',
    });

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('should throw EMAIL_TAKEN if user exists', async () => {
    mockRepo.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: 'hashed',
      role: 'staff',
      isActive: true,
    });

    await expect(
      service.register({
        email: 'test@test.com',
        password: 'password123',
      })
    ).rejects.toThrow('EMAIL_TAKEN');
  });


  // LOGIN TESTS
  

  it('Successfullylogin and return token', async () => {
    mockRepo.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: 'hashed_password',
      role: 'staff',
      isActive: true,
    });

    (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      true
    );

    (jwt.sign as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      'fake_jwt_token'
    );

    const result = await service.login({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.accessToken).toBe('fake_jwt_token');
    expect(result.user.email).toBe('test@test.com');
  });

  it('should throw INVALID_CREDENTIALS if user not found', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'wrong@test.com',
        password: 'password123',
      })
    ).rejects.toThrow('INVALID_CREDENTIALS');
  });

  it('should throw INVALID_CREDENTIALS if password incoorect', async () => {
    mockRepo.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: 'hashed_password',
      role: 'staff',
      isActive: true,
    });

    (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      false
    );

    await expect(
      service.login({
        email: 'test@test.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('INVALID_CREDENTIALS');
  });
});