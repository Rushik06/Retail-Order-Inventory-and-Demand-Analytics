import type { User } from './types/auth.types.js';

export class AuthRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async clear(): Promise<void> {
    this.users = [];
  }
}