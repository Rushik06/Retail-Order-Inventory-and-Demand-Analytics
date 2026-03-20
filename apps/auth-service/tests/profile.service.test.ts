/*eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ProfileService } from "../src/services/profile.service.js";

/* MOCKS */

vi.mock("@repo/shared", () => ({
  AppError: class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }
}));

vi.mock("../src/constants/errors.js", () => ({
  ERRORS: {
    USER_NOT_FOUND: "USER_NOT_FOUND"
  }
}));

vi.mock("../src/constants/messages.js", () => ({
  MESSAGES: {
    ACCOUNT_DELETED: "Account deleted successfully"
  }
}));
/* TESTS */

describe("ProfileService", () => {

  let service: ProfileService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };

    service = new ProfileService(mockRepo);
    vi.clearAllMocks();
  });

  /* GET PROFILE */

  describe("getProfile", () => {

    it("should return user profile", async () => {

      mockRepo.findById.mockResolvedValue({
        id: "1",
        name: "John",
        email: "john@test.com",
        isActive: true
      });

      const result = await service.getProfile("1");

      expect(result?.name).toBe("John");
      expect(mockRepo.findById).toHaveBeenCalledWith("1");

    });

    it("should throw USER_NOT_FOUND if user does not exist", async () => {

      mockRepo.findById.mockResolvedValue(null);

      await expect(service.getProfile("1")).rejects.toThrow("USER_NOT_FOUND");

      expect(mockRepo.findById).toHaveBeenCalledWith("1");

    });

  });

  /* UPDATE PROFILE */

  describe("updateProfile", () => {

    it("should update and return updated profile", async () => {

      mockRepo.update.mockResolvedValue({
        id: "1",
        name: "Updated",
        email: "updated@test.com"
      });

      const result = await service.updateProfile("1", { name: "Updated" });

      expect(result.name).toBe("Updated");
      expect(mockRepo.update).toHaveBeenCalledWith("1", { name: "Updated" });

    });

  });

  /* DELETE PROFILE */

  describe("deleteProfile", () => {

    it("should delete profile and return success message", async () => {

      mockRepo.findById.mockResolvedValue({
        id: "1",
        name: "John",
        email: "john@test.com"
      });

      mockRepo.delete.mockResolvedValue(true);

      const result = await service.deleteProfile("1");

      expect(result).toEqual({ message: "Account deleted successfully" });
      expect(mockRepo.delete).toHaveBeenCalledWith("1");

    });

  });

});