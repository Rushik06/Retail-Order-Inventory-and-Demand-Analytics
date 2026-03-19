import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthController } from "../src/controller/auth.controller.js";
import type { AuthService } from "../src/services/auth.service.js";
import type { Request, Response } from "express";

/*eslint-disable */
describe("AuthController", () => {

  const mockService = {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    getUsers: vi.fn()
  } as unknown as AuthService;

  const controller = new AuthController(mockService);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* REGISTER */

  describe("register", () => {

    it("returns 201 and user data when successful", async () => {

      const req = {
        body: { email: "test@test.com", password: "123456" }
      } as Request;

      const res = mockResponse();

      (mockService.register as any).mockResolvedValue({
        id: "1",
        email: "test@test.com"
      });

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "1", email: "test@test.com" });

    });

    it("throws EMAIL_TAKEN error when email already exists", async () => {

      const req = {
        body: { email: "dup@test.com", password: "123456" }
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

    it("returns 200 with tokens when successful", async () => {

      const req = {
        body: { email: "test@test.com", password: "123456" }
      } as Request;

      const res = mockResponse();

      (mockService.login as any).mockResolvedValue({
        accessToken: "access",
        refreshToken: "refresh",
        user: { email: "test@test.com" }
      });

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ accessToken: "access" })
      );

    });

    it("throws INVALID_CREDENTIALS when credentials are wrong", async () => {

      const req = {
        body: { email: "wrong@test.com", password: "wrongpass" }
      } as Request;

      const res = mockResponse();

      (mockService.login as any).mockRejectedValue(
        Object.assign(new Error("INVALID_CREDENTIALS"), { statusCode: 401 })
      );

      await expect(controller.login(req, res)).rejects.toThrow("INVALID_CREDENTIALS");

    });

  });

  /* REFRESH */

  describe("refresh", () => {

    it("returns 200 with new accessToken", async () => {

      const req = {
        body: { refreshToken: "valid-refresh-token" }
      } as Request;

      const res = mockResponse();

      (mockService.refresh as any).mockResolvedValue({
        accessToken: "new-access-token"
      });

      await controller.refresh(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ accessToken: "new-access-token" })
      );

    });

    it("throws INVALID_TOKEN when refresh token is invalid", async () => {

      const req = {
        body: { refreshToken: "invalid-token" }
      } as Request;

      const res = mockResponse();

      (mockService.refresh as any).mockRejectedValue(
        Object.assign(new Error("INVALID_TOKEN"), { statusCode: 401 })
      );

      await expect(controller.refresh(req, res)).rejects.toThrow("INVALID_TOKEN");

    });

  });

  /* LOGOUT */

  describe("logout", () => {

    it("returns 200 with success message", async () => {

      const req = {
        body: { refreshToken: "valid-refresh-token" }
      } as Request;

      const res = mockResponse();

      (mockService.logout as any).mockResolvedValue(undefined);

      await controller.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });

    });

  });

  /* GET USERS */

  describe("getUsers", () => {

    it("returns 200 with list of users", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockUsers = [
        { id: "1", email: "a@test.com" },
        { id: "2", email: "b@test.com" }
      ];

      (mockService.getUsers as any).mockResolvedValue(mockUsers);

      await controller.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);

    });

  });

});