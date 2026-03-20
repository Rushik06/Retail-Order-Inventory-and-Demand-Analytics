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
      rotateRefreshToken: vi.fn(),
      deleteRefreshToken: vi.fn(),
      getAllUsers: vi.fn()
    };

    service = new AuthService(mockRepo);
    vi.clearAllMocks();
  });

  /* REGISTER */

  describe("register", () => {

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

      // password must not be returned
      expect(result).not.toHaveProperty("password");

    });

    it("should hash password before storing", async () => {

      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({
        id: "123",
        name: "Test User",
        email: "test@test.com"
      });

      await service.register({
        name: "Test User",
        email: "test@test.com",
        password: "plainpassword"
      });

      const calledWith = mockRepo.create.mock.calls[0][0];
      expect(calledWith.password).not.toBe("plainpassword");
      expect(await bcrypt.compare("plainpassword", calledWith.password)).toBe(true);

    });

    it("should throw EMAIL_TAKEN if user already exists", async () => {

      mockRepo.findByEmail.mockResolvedValue({ id: "1", email: "test@test.com" });

      await expect(
        service.register({
          name: "Test",
          email: "test@test.com",
          password: "password123"
        })
      ).rejects.toThrow("EMAIL_TAKEN");

      expect(mockRepo.create).not.toHaveBeenCalled();

    });

  });

  /* LOGIN */

  describe("login", () => {

    it("should login successfully and return tokens", async () => {

      const hashed = await bcrypt.hash("password123", 10);

      mockRepo.findByEmail.mockResolvedValue({
        id: "123",
        name: "Test User",
        email: "test@test.com",
        password: hashed
      });

      mockRepo.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.login({
        email: "test@test.com",
        password: "password123"
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user.email).toBe("test@test.com");

    });

    it("should call saveRefreshToken after login", async () => {

      const hashed = await bcrypt.hash("password123", 10);

      mockRepo.findByEmail.mockResolvedValue({
        id: "123",
        name: "Test User",
        email: "test@test.com",
        password: hashed
      });

      mockRepo.saveRefreshToken.mockResolvedValue(undefined);

      await service.login({ email: "test@test.com", password: "password123" });

      expect(mockRepo.saveRefreshToken).toHaveBeenCalled();

    });

    it("should default role to staff when no UserRole found", async () => {

      const hashed = await bcrypt.hash("password123", 10);

      mockRepo.findByEmail.mockResolvedValue({
        id: "123",
        name: "Test User",
        email: "test@test.com",
        password: hashed
      });

      mockRepo.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.login({ email: "test@test.com", password: "password123" });

      expect(result.user.role).toBe("staff");

    });

    it("should throw INVALID_CREDENTIALS if user not found", async () => {

      mockRepo.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: "unknown@test.com", password: "pass123" })
      ).rejects.toThrow("INVALID_CREDENTIALS");

    });

    it("should throw INVALID_CREDENTIALS if password is incorrect", async () => {

      const hashed = await bcrypt.hash("correctpass", 10);

      mockRepo.findByEmail.mockResolvedValue({
        id: "123",
        name: "Test User",
        email: "test@test.com",
        password: hashed
      });

      await expect(
        service.login({ email: "test@test.com", password: "wrongpass" })
      ).rejects.toThrow("INVALID_CREDENTIALS");

    });

  });

  /* REFRESH */

  describe("refresh", () => {

    it("should refresh token successfully", async () => {

      const refreshToken = jwt.sign({ id: "123" }, "test-refresh-secret");

      mockRepo.verifyRefreshToken.mockResolvedValue(undefined);
      mockRepo.rotateRefreshToken.mockResolvedValue("new-refresh-token");

      mockRepo.findById.mockResolvedValue({
        id: "123",
        name: "Test User",
        email: "test@test.com"
      });

      const result = await service.refresh(refreshToken);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(mockRepo.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(mockRepo.rotateRefreshToken).toHaveBeenCalled();

    });

    it("should throw INVALID_REFRESH for invalid token", async () => {

      await expect(
        service.refresh("invalid-token")
      ).rejects.toThrow("INVALID_REFRESH");

    });

    it("should throw INVALID_REFRESH if user not found after decode", async () => {

      const refreshToken = jwt.sign({ id: "ghost" }, "test-refresh-secret");

      mockRepo.verifyRefreshToken.mockResolvedValue(undefined);
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        service.refresh(refreshToken)
      ).rejects.toThrow("INVALID_REFRESH");

    });

  });

  /* LOGOUT */

  describe("logout", () => {

    it("should logout successfully", async () => {

      mockRepo.deleteRefreshToken.mockResolvedValue(undefined);

      const result = await service.logout("sometoken");

      expect(result).toEqual({ message: "Logged out successfully" });
      expect(mockRepo.deleteRefreshToken).toHaveBeenCalledWith("sometoken");

    });

  });

  /* GET USERS */

  describe("getUsers", () => {

    it("should return all users", async () => {

      const mockUsers = [
        { id: "1", email: "a@test.com" },
        { id: "2", email: "b@test.com" }
      ];

      mockRepo.getAllUsers.mockResolvedValue(mockUsers);

      const result = await service.getUsers();

      expect(result).toEqual(mockUsers);
      expect(mockRepo.getAllUsers).toHaveBeenCalled();

    });

  });

});