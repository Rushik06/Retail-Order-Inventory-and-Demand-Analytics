/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileController } from "../src/controller/profile.controller.js";
import type { ProfileService } from "../src/services/profile.service.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../src/middleware/auth.middleware.js";

/* MOCKS */

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

const mockRequest = (userId: string, body: any = {}) =>
  ({ user: { id: userId }, body }) as AuthenticatedRequest;

describe("ProfileController", () => {

  const mockService = {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    deleteProfile: vi.fn()
  } as unknown as ProfileService;

  const controller = new ProfileController(mockService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* GET PROFILE */

  describe("getProfile", () => {

    it("should return 200 with profile data", async () => {

      const req = mockRequest("user-123");
      const res = mockResponse();

      (mockService.getProfile as any).mockResolvedValue({
        id: "user-123",
        name: "John Doe",
        email: "john@test.com"
      });

      await controller.getProfile(req, res);

      expect(mockService.getProfile).toHaveBeenCalledWith("user-123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: "user-123",
        name: "John Doe",
        email: "john@test.com"
      });

    });

    it("should pass correct userId from req.user.id", async () => {

      const req = mockRequest("another-user-id");
      const res = mockResponse();

      (mockService.getProfile as any).mockResolvedValue({ id: "another-user-id" });

      await controller.getProfile(req, res);

      expect(mockService.getProfile).toHaveBeenCalledWith("another-user-id");

    });

    it("should throw when service throws USER_NOT_FOUND", async () => {

      const req = mockRequest("user-123");
      const res = mockResponse();

      (mockService.getProfile as any).mockRejectedValue(
        Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(controller.getProfile(req, res)).rejects.toThrow("USER_NOT_FOUND");

    });

  });

  /* UPDATE PROFILE */

  describe("updateProfile", () => {

    it("should return 200 with updated profile", async () => {

      const req = mockRequest("user-123", { name: "Updated Name" });
      const res = mockResponse();

      (mockService.updateProfile as any).mockResolvedValue({
        id: "user-123",
        name: "Updated Name",
        email: "john@test.com"
      });

      await controller.updateProfile(req, res);

      expect(mockService.updateProfile).toHaveBeenCalledWith(
        "user-123",
        { name: "Updated Name" }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: "user-123",
        name: "Updated Name",
        email: "john@test.com"
      });

    });

    it("should pass req.body as update data", async () => {

      const req = mockRequest("user-123", { name: "New Name", email: "new@test.com" });
      const res = mockResponse();

      (mockService.updateProfile as any).mockResolvedValue({});

      await controller.updateProfile(req, res);

      expect(mockService.updateProfile).toHaveBeenCalledWith(
        "user-123",
        { name: "New Name", email: "new@test.com" }
      );

    });

    it("should throw when service throws USER_NOT_FOUND", async () => {

      const req = mockRequest("ghost-id", { name: "Name" });
      const res = mockResponse();

      (mockService.updateProfile as any).mockRejectedValue(
        Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(controller.updateProfile(req, res)).rejects.toThrow("USER_NOT_FOUND");

    });

  });

  /* DELETE PROFILE */

  describe("deleteProfile", () => {

    it("should return 200 with success message", async () => {

      const req = mockRequest("user-123");
      const res = mockResponse();

      (mockService.deleteProfile as any).mockResolvedValue(undefined);

      await controller.deleteProfile(req, res);

      expect(mockService.deleteProfile).toHaveBeenCalledWith("user-123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Account deleted successfully" });

    });

    it("should throw when service throws USER_NOT_FOUND", async () => {

      const req = mockRequest("ghost-id");
      const res = mockResponse();

      (mockService.deleteProfile as any).mockRejectedValue(
        Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(controller.deleteProfile(req, res)).rejects.toThrow("USER_NOT_FOUND");

    });

  });

});