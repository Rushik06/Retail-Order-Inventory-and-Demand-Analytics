import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { AuthRepository } from "../repository/auth.repository.js";
import type {
  RegisterUserInput,
  LoginInput,
} from "../types/auth.types.js";
import { env } from "../config/index.js";

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  
  // REGISTER
  
  async register(input: RegisterUserInput) {
    const existingUser = await this.repo.findByEmail(input.email);

    if (existingUser) {
      throw new Error("EMAIL_TAKEN");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser = await this.repo.create({
      id: randomUUID(),
      name: input.name,
      email: input.email,
      password: hashedPassword,
      isActive: true,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  
  // LOGIN
  
  async login(input: LoginInput) {
    const user = await this.repo.findByEmail(input.email);

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatch = await bcrypt.compare(
      input.password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const role = user.role ?? "ADMIN"; 

    // Access token 
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: role,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.ACCESS_TOKEN_EXPIRY } as SignOptions
    );

    // Refresh token 
    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.REFRESH_TOKEN_EXPIRY } as SignOptions
    );

    if (this.repo.saveRefreshToken) {
      await this.repo.saveRefreshToken(refreshToken, user.id);
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
      },
    };
  }


  // REFRESH TOKEN
  
  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      ) as { id: string };

      if (this.repo.verifyRefreshToken) {
        await this.repo.verifyRefreshToken(refreshToken);
      }

      const user = await this.repo.findById(payload.id);

      if (!user) {
        throw new Error("INVALID_REFRESH");
      }

      if (!user.role) {
        throw new Error("ROLE_NOT_FOUND");
      }

      const newAccessToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRY } as SignOptions
      );

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new Error("INVALID_REFRESH");
    }
  }

  // LOGOUT
  
  async logout(refreshToken: string) {
    if (this.repo.verifyRefreshToken) {
      await this.repo.verifyRefreshToken(refreshToken);
    }

    return {
      message: "Logged out successfully",
    };
  }
}