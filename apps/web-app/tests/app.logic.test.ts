/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApi = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
const mockSetAccessToken = vi.hoisted(() => vi.fn());
const mockSetUser = vi.hoisted(() => vi.fn());

vi.mock("../src/api/axios", () => ({ default: mockApi }));
vi.mock("../src/utils/token", () => ({ setAccessToken: mockSetAccessToken }));

vi.mock("../src/app/app.state", () => ({
  useAuthStore: {
    getState: vi.fn(function () {
      return { setUser: mockSetUser };
    })
  }
}));

import {
  loginUser,
  registerUser,
  assignUserRole,
  fetchUsers,
  requestRoleAccess
} from "../src/app/app.logic.js";

describe("Auth Actions", () => {

  beforeEach(() => {
    mockApi.get.mockClear();
    mockApi.post.mockClear();
    mockSetAccessToken.mockClear();
    mockSetUser.mockClear();
  });

  /* LOGIN */

  describe("loginUser", () => {

    it("calls POST /auth/login with email and password", async () => {
      mockApi.post.mockResolvedValue({
        data: { accessToken: "token-123", user: { id: "1", email: "john@test.com" } }
      });

      await loginUser("john@test.com", "pass123");

      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "john@test.com",
        password: "pass123"
      });
    });

    it("sets access token after login", async () => {
      mockApi.post.mockResolvedValue({
        data: { accessToken: "token-123", user: { id: "1" } }
      });

      await loginUser("john@test.com", "pass123");

      expect(mockSetAccessToken).toHaveBeenCalledWith("token-123");
    });

    it("sets user in store after login", async () => {
      const mockUser = { id: "1", email: "john@test.com", role: "admin" };
      mockApi.post.mockResolvedValue({
        data: { accessToken: "token-123", user: mockUser }
      });

      await loginUser("john@test.com", "pass123");

      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    });

    it("returns response data", async () => {
      const mockData = { accessToken: "token-123", user: { id: "1" } };
      mockApi.post.mockResolvedValue({ data: mockData });

      const result = await loginUser("john@test.com", "pass123");

      expect(result).toEqual(mockData);
    });

    it("throws when API call fails", async () => {
      mockApi.post.mockRejectedValue(new Error("INVALID_CREDENTIALS"));

      await expect(
        loginUser("wrong@test.com", "wrong")
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

  });

  /* REGISTER */

  describe("registerUser", () => {

    it("calls POST /auth/register with name, email, password", async () => {
      mockApi.post.mockResolvedValue({ data: { id: "1", email: "john@test.com" } });

      await registerUser("John", "john@test.com", "pass123");

      expect(mockApi.post).toHaveBeenCalledWith("/auth/register", {
        name: "John",
        email: "john@test.com",
        password: "pass123"
      });
    });

    it("returns response data", async () => {
      const mockData = { id: "1", name: "John", email: "john@test.com" };
      mockApi.post.mockResolvedValue({ data: mockData });

      const result = await registerUser("John", "john@test.com", "pass123");

      expect(result).toEqual(mockData);
    });

    it("throws when email already exists", async () => {
      mockApi.post.mockRejectedValue(new Error("EMAIL_TAKEN"));

      await expect(
        registerUser("John", "dup@test.com", "pass123")
      ).rejects.toThrow("EMAIL_TAKEN");
    });

  });

  /* ASSIGN ROLE */

  describe("assignUserRole", () => {

    it("calls POST /rbac/assign-role with userId and roleName", async () => {
      mockApi.post.mockResolvedValue({ data: { success: true } });

      await assignUserRole("user-1", "admin");

      expect(mockApi.post).toHaveBeenCalledWith("/rbac/assign-role", {
        userId: "user-1",
        roleName: "admin"
      });
    });

    it("returns response data", async () => {
      mockApi.post.mockResolvedValue({ data: { success: true } });

      const result = await assignUserRole("user-1", "manager");

      expect(result).toEqual({ success: true });
    });

  });

  /* FETCH USERS */

  describe("fetchUsers", () => {

    it("calls GET /auth/users and returns data", async () => {
      const mockUsers = [{ id: "1", email: "a@test.com" }];
      mockApi.get.mockResolvedValue({ data: mockUsers });

      const result = await fetchUsers();

      expect(mockApi.get).toHaveBeenCalledWith("/auth/users");
      expect(result).toEqual(mockUsers);
    });

  });

  /* REQUEST ROLE ACCESS */

  describe("requestRoleAccess", () => {

    it("calls POST /rbac/request-role with roleName", async () => {
      mockApi.post.mockResolvedValue({ data: { message: "Request sent" } });

      await requestRoleAccess("manager");

      expect(mockApi.post).toHaveBeenCalledWith("/rbac/request-role", {
        roleName: "manager"
      });
    });

    it("returns response data", async () => {
      mockApi.post.mockResolvedValue({ data: { message: "Request sent" } });

      const result = await requestRoleAccess("admin");

      expect(result).toEqual({ message: "Request sent" });
    });

  });

});