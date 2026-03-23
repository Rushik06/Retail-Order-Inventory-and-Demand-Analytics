/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PasswordController } from "../src/controller/password.controller.js";
import type { PasswordService } from "../src/services/password.service.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../src/middleware/auth.middleware.js";

/* MOCKS */

vi.mock("../src/models/index.js", () => ({}));

vi.mock("../src/config/index.js", () => ({
  env: {
    PORT: "3000",
    JWT_ACCESS_SECRET: "test-access-secret",
    JWT_REFRESH_SECRET: "test-refresh-secret",
    ACCESS_TOKEN_EXPIRY: "15m",
    REFRESH_TOKEN_EXPIRY: "7d",
    DATABASE_URL: "postgres://test",
    REDIS_URL: "redis://test"
  },
  sequelize: {
    define: vi.fn(),
    sync: vi.fn(),
    transaction: vi.fn(),
    query: vi.fn(),
    dialect: "postgres",
    queryInterface: { define: vi.fn() }
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

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("PasswordController", () => {

  const mockService = {
    changePassword: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn()
  } as unknown as PasswordService;

  const controller = new PasswordController(mockService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CHANGE PASSWORD */

  describe("changePassword", () => {

    it("should return 200 with success message", async () => {

      const req = {
        user: { id: "user-123" },
        body: { currentPassword: "oldpass", newPassword: "newpass" }
      } as AuthenticatedRequest;

      const res = mockResponse();

      (mockService.changePassword as any).mockResolvedValue({
        message: "Password changed successfully"
      });

      await controller.changePassword(req, res);

      expect(mockService.changePassword).toHaveBeenCalledWith(
        "user-123", "oldpass", "newpass"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Password changed successfully" });

    });

    it("should use req.user.id as userId", async () => {

      const req = {
        user: { id: "different-id" },
        body: { currentPassword: "old", newPassword: "new" }
      } as AuthenticatedRequest;

      const res = mockResponse();

      (mockService.changePassword as any).mockResolvedValue({ message: "ok" });

      await controller.changePassword(req, res);

      expect(mockService.changePassword).toHaveBeenCalledWith("different-id", "old", "new");

    });

    it("should throw when service throws USER_NOT_FOUND", async () => {

      const req = {
        user: { id: "user-123" },
        body: { currentPassword: "old", newPassword: "new" }
      } as AuthenticatedRequest;

      const res = mockResponse();

      (mockService.changePassword as any).mockRejectedValue(
        Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(controller.changePassword(req, res)).rejects.toThrow("USER_NOT_FOUND");

    });

    it("should throw when service throws INVALID_CURRENT_PASSWORD", async () => {

      const req = {
        user: { id: "user-123" },
        body: { currentPassword: "wrong", newPassword: "new" }
      } as AuthenticatedRequest;

      const res = mockResponse();

      (mockService.changePassword as any).mockRejectedValue(
        Object.assign(new Error("INVALID_CURRENT_PASSWORD"), { statusCode: 400 })
      );

      await expect(controller.changePassword(req, res)).rejects.toThrow(
        "INVALID_CURRENT_PASSWORD"
      );

    });

  });

  /* FORGOT PASSWORD */

  describe("forgotPassword", () => {

    it("should return 200 with OTP sent message", async () => {

      const req = { body: { email: "john@test.com" } } as Request;
      const res = mockResponse();

      (mockService.forgotPassword as any).mockResolvedValue({
        message: "OTP sent to registered email"
      });

      await controller.forgotPassword(req, res);

      expect(mockService.forgotPassword).toHaveBeenCalledWith("john@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "OTP sent to registered email" });

    });

    it("should throw when user not found", async () => {

      const req = { body: { email: "ghost@test.com" } } as Request;
      const res = mockResponse();

      (mockService.forgotPassword as any).mockRejectedValue(
        Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(controller.forgotPassword(req, res)).rejects.toThrow("USER_NOT_FOUND");

    });

  });

  /* RESET PASSWORD */

  describe("resetPassword", () => {

    it("should return 200 with success message", async () => {

      const req = {
        body: { email: "john@test.com", otp: "123456", newPassword: "newpass123" }
      } as Request;

      const res = mockResponse();

      (mockService.resetPassword as any).mockResolvedValue({
        message: "Password reset successfully"
      });

      await controller.resetPassword(req, res);

      expect(mockService.resetPassword).toHaveBeenCalledWith(
        "john@test.com", "123456", "newpass123"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Password reset successfully" });

    });

    it("should throw when OTP is invalid", async () => {

      const req = {
        body: { email: "john@test.com", otp: "000000", newPassword: "new" }
      } as Request;

      const res = mockResponse();

      (mockService.resetPassword as any).mockRejectedValue(
        Object.assign(new Error("INVALID_OTP"), { statusCode: 400 })
      );

      await expect(controller.resetPassword(req, res)).rejects.toThrow("INVALID_OTP");

    });

    it("should throw when OTP is expired", async () => {

      const req = {
        body: { email: "john@test.com", otp: "123456", newPassword: "new" }
      } as Request;

      const res = mockResponse();

      (mockService.resetPassword as any).mockRejectedValue(
        Object.assign(new Error("OTP_EXPIRED"), { statusCode: 400 })
      );

      await expect(controller.resetPassword(req, res)).rejects.toThrow("OTP_EXPIRED");

    });

    it("should throw when user not found", async () => {

      const req = {
        body: { email: "ghost@test.com", otp: "123456", newPassword: "new" }
      } as Request;

      const res = mockResponse();

      (mockService.resetPassword as any).mockRejectedValue(
        Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(controller.resetPassword(req, res)).rejects.toThrow("USER_NOT_FOUND");

    });

  });

});