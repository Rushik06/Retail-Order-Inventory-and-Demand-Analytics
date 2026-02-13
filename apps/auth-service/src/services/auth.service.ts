import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { AuthRepository } from '../auth.repository.js';
import type { RegisterInput,LoginInput } from '../constants/auth.types.js';

export class AuthService {
  constructor(private repo: AuthRepository) {}

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
      role: 'staff',   // default role
      isActive: true,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }

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

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'secret',                 
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}