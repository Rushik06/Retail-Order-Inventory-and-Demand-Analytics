/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthController } from "../src/controller/auth.controller.js";
import type { AuthService } from "../src/services/auth.service.js";
import type { Request, Response } from "express";

/* MOCKS */

// Prevent config/env.ts from crashing on missing PORT env var
vi.mock("../src/config/index.js", () => ({
  env: {
    PORT: "3000",
    JWT_ACCESS_SECRET: "test-access-secret",
    JWT_REFRESH_SECRET: "test-refresh-secret",
    ACCESS_TOKEN_EXPIRY: "15m",
    REFRESH_TOKEN_EXPIRY: "7d",
    DATABASE_URL: "postgres://test",
    REDIS_URL: "redis://test"
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

vi.mock("../src/constants/auth.js", () => ({
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
};

describe("AuthController", () => {

  const mockService = {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    getUsers: vi.fn()
  } as unknown as AuthService;

  const controller = new AuthController(mockService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* REGISTER */

  describe("register", () => {

    it("should return 201 with user data on success", async () => {

      const req = {
        body: { name: "John", email: "john@test.com", password: "pass123" }
      } as Request;

      const res = mockResponse();

      (mockService.register as any).mockResolvedValue({
        id: "1",
        name: "John",
        email: "john@test.com"
      });

      await controller.register(req, res);

      expect(mockService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: "1",
        name: "John",
        email: "john@test.com"
      });

    });

    it("should throw when service throws EMAIL_TAKEN", async () => {

      const req = {
        body: { name: "John", email: "dup@test.com", password: "pass123" }
      } as Request;

      const res = mockResponse();

      (mockService.register as any).mockRejectedValue(
        Object.assign(new Error("EMAIL_TAKEN"), { statusCode: 409 })
      );

      await expect(controller.register(req, res)).rejects.toThrow("EMAIL_TAKEN");

    });

  });

  /* LOGIN */

  describe("login", () => {

    it("should return 200 with accessToken and user, set refreshToken cookie", async () => {

      const req = {
        body: { email: "john@test.com", password: "pass123" }
      } as Request;

      const res = mockResponse();

      (mockService.login as any).mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: { id: "1", email: "john@test.com" }
      });

      await controller.login(req, res);

      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "refresh-token",
        expect.any(Object)
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: "access-token",
        user: { id: "1", email: "john@test.com" }
      });

    });

    it("should not include refreshToken in response body", async () => {

      const req = { body: { email: "john@test.com", password: "pass123" } } as Request;
      const res = mockResponse();

      (mockService.login as any).mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: { id: "1", email: "john@test.com" }
      });

      await controller.login(req, res);

      const jsonCall = (res.json as any).mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty("refreshToken");

    });

    it("should throw when service throws INVALID_CREDENTIALS", async () => {

      const req = { body: { email: "x@test.com", password: "wrong" } } as Request;
      const res = mockResponse();

      (mockService.login as any).mockRejectedValue(
        Object.assign(new Error("INVALID_CREDENTIALS"), { statusCode: 401 })
      );

      await expect(controller.login(req, res)).rejects.toThrow("INVALID_CREDENTIALS");

    });

  });

  /* REFRESH */

  describe("refresh", () => {

    it("should return 200 with new accessToken and set new cookie", async () => {

      const req = {
        cookies: { refreshToken: "valid-refresh-token" }
      } as unknown as Request;

      const res = mockResponse();

      (mockService.refresh as any).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token"
      });

      await controller.refresh(req, res);

      expect(mockService.refresh).toHaveBeenCalledWith("valid-refresh-token");
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", "new-refresh-token", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken: "new-access-token" });

    });

    it("should throw AppError when refreshToken cookie is missing", async () => {

      const req = { cookies: {} } as unknown as Request;
      const res = mockResponse();

      await expect(controller.refresh(req, res)).rejects.toThrow("Refresh token is required");
      expect(mockService.refresh).not.toHaveBeenCalled();

    });

  });

  /* LOGOUT */

  describe("logout", () => {

    it("should return 200 and clear cookie", async () => {

      const req = {
        cookies: { refreshToken: "valid-refresh-token" }
      } as unknown as Request;

      const res = mockResponse();

      (mockService.logout as any).mockResolvedValue({ message: "Logged out successfully" });

      await controller.logout(req, res);

      expect(mockService.logout).toHaveBeenCalledWith("valid-refresh-token");
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });

    });

    it("should throw AppError when refreshToken cookie is missing", async () => {

      const req = { cookies: {} } as unknown as Request;
      const res = mockResponse();

      await expect(controller.logout(req, res)).rejects.toThrow("Refresh token is required");
      expect(mockService.logout).not.toHaveBeenCalled();
      expect(res.clearCookie).not.toHaveBeenCalled();

    });

  });

  /* GET USERS */

  describe("getUsers", () => {

    it("should return 200 with list of users", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (mockService.getUsers as any).mockResolvedValue([
        { id: "1", email: "a@test.com" },
        { id: "2", email: "b@test.com" }
      ]);

      await controller.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: "1", email: "a@test.com" },
        { id: "2", email: "b@test.com" }
      ]);

    });

  });

});