import bcrypt from 'bcrypt';
import jwt ,{type SignOptions} from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import type { AuthRepository } from '../auth.repository.js';
import type { RegisterInput, LoginInput } from '../types/auth.types.js';
import { env } from '../config/index.js';

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  // ---------------------------
  // REGISTER
  // ---------------------------
  async register(input: RegisterInput) {
    const existingUser = await this.repo.findByEmail(input.email);

    if (existingUser) {
      throw new Error('EMAIL_TAKEN');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser = await this.repo.create({
      id: randomUUID(),
      email: input.email,
      password: hashedPassword,
      role: 'staff',
      isActive: true,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }

  // ---------------------------
  // LOGIN
  // ---------------------------
  async login(input: LoginInput) {
    const user = await this.repo.findByEmail(input.email);

    if (!user || !user.isActive) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const passwordMatch = await bcrypt.compare(
      input.password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Access token
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_ACCESS_SECRET as string,
      { expiresIn: env.ACCESS_TOKEN_EXPIRY } as SignOptions
    );

    // Refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET as string,
      { expiresIn: env.REFRESH_TOKEN_EXPIRY } as SignOptions
    );

    // Save refresh token in DB
    if (this.repo.saveRefreshToken) {
      await this.repo.saveRefreshToken(refreshToken, user.id);
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ---------------------------
  // REFRESH TOKEN
  // ---------------------------
  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      ) as { id: string };

      //  verify refresh token exists in DB
      if (this.repo.verifyRefreshToken) {
        await this.repo.verifyRefreshToken(refreshToken);
      }

      const user = await this.repo.findByEmail?.(payload.id);

      if (!user) {
        throw new Error('INVALID_REFRESH');
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_ACCESS_SECRET!,
        { expiresIn: '1h' }
      );

      return {
        accessToken: newAccessToken,
      };

    } catch {
      throw new Error('INVALID_REFRESH');
    }
  }

  // ---------------------------
  // LOGOUT
  // ---------------------------
  async logout(refreshToken: string) {
    if (this.repo.verifyRefreshToken) {
      await this.repo.verifyRefreshToken(refreshToken);
    }

    return { message: 'Logged out successfully' };
  }
}