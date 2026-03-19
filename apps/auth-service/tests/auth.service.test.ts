/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthService } from "../src/services/auth.service.js";

/* MOCKS */

vi.mock("../src/config/index.js", () => ({
  env: {
    JWT_ACCESS_SECRET: "test-access-secret",
    JWT_REFRESH_SECRET: "test-refresh-secret",
    ACCESS_TOKEN_EXPIRY: "15m",
    REFRESH_TOKEN_EXPIRY: "7d"
  }
}));

vi.mock("../src/models/userRole.model.js", () => ({
  UserRole: {
    findOne: vi.fn().mockResolvedValue(null)
  }
}));

vi.mock("../src/models/role.model.js", () => ({
  Role: {}
}));

vi.mock("../src/constants/errors.js", () => ({
  ERRORS: {
    EMAIL_TAKEN: "EMAIL_TAKEN",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    INVALID_REFRESH_TOKEN: "INVALID_REFRESH"
  }
}));

vi.mock("../src/constants/messages.js", () => ({
  MESSAGES: {
    LOGOUT_SUCCESS: "Logged out successfully"
  }
}));

vi.mock("@repo/shared", () => ({
  AppError: class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

/* TESTS */

describe("AuthService", () => {

  let mockRepo: any;
  let service: AuthService;

  beforeEach(() => {
    mockRepo = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      saveRefreshToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
      getAllUsers: vi.fn()
    };

    service = new AuthService(mockRepo);
    vi.clearAllMocks();
  });

  /* REGISTER */

  it("should register a new user successfully", async () => {

    mockRepo.findByEmail.mockResolvedValue(null);

    mockRepo.create.mockResolvedValue({
      id: "123",
      name: "Test User",
      email: "test@test.com",
      password: "hashed_password",
      isActive: true
    });

    const result = await service.register({
      name: "Test User",
      email: "test@test.com",
      password: "password123"
    });

    expect(result).toEqual({
      id: "123",
      name: "Test User",
      email: "test@test.com"
    });

    expect(mockRepo.findByEmail).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();

  });

  it("should throw EMAIL_TAKEN if user exists", async () => {

    mockRepo.findByEmail.mockResolvedValue({
      id: "1",
      email: "test@test.com"
    });

    await expect(
      service.register({
        name: "Test",
        email: "test@test.com",
        password: "password123"
      })
    ).rejects.toThrow("EMAIL_TAKEN");

  });

  /* LOGIN */

  it("should login successfully and return tokens", async () => {

    const hashed = await bcrypt.hash("password123", 10);

    mockRepo.findByEmail.mockResolvedValue({
      id: "123",
      name: "Test User",
      email: "test@test.com",
      password: hashed
    });

    const result = await service.login({
      email: "test@test.com",
      password: "password123"
    });

    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("refreshToken");
    expect(result.user.email).toBe("test@test.com");

  });

  it("should throw INVALID_CREDENTIALS if user not found", async () => {

    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: "unknown@test.com",
        password: "pass123"
      })
    ).rejects.toThrow("INVALID_CREDENTIALS");

  });

  it("should throw INVALID_CREDENTIALS if password incorrect", async () => {

    const hashed = await bcrypt.hash("correctpass", 10);

    mockRepo.findByEmail.mockResolvedValue({
      id: "123",
      name: "Test User",
      email: "test@test.com",
      password: hashed
    });

    await expect(
      service.login({
        email: "test@test.com",
        password: "wrongpass"
      })
    ).rejects.toThrow("INVALID_CREDENTIALS");

  });

  /* REFRESH */

  it("should refresh token successfully", async () => {

    // Sign with the same secret the mocked env exposes
    const refreshToken = jwt.sign(
      { id: "123" },
      "test-refresh-secret"
    );

    mockRepo.findById.mockResolvedValue({
      id: "123",
      name: "Test User",
      email: "test@test.com"
    });

    const result = await service.refresh(refreshToken);

    expect(result).toHaveProperty("accessToken");

  });

  it("should throw INVALID_REFRESH for invalid token", async () => {

    await expect(
      service.refresh("invalid-token")
    ).rejects.toThrow("INVALID_REFRESH");

  });

  /* LOGOUT */

  it("should logout successfully", async () => {

    const result = await service.logout("sometoken");

    expect(result).toEqual({ message: "Logged out successfully" });

  });

});