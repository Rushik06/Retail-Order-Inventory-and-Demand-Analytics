/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApi = vi.hoisted(() => ({ post: vi.fn() }));
const mockClearTokens = vi.hoisted(() => vi.fn());

vi.mock("../src/api/axios", () => ({ default: mockApi }));
vi.mock("../src/utils/token", () => ({ clearTokens: mockClearTokens }));

import { useAuthStore } from "../src/app/app.state.js";

const mockUser = { id: "1", name: "John", email: "john@test.com", role: "admin" };

describe("useAuthStore", () => {

  beforeEach(() => {
    mockApi.post.mockClear();
    mockClearTokens.mockClear();
    // Reset store to initial state before each test
    useAuthStore.setState({ user: null });
  });

  /* INITIAL STATE */

  it("has null user as initial state", () => {
    expect(useAuthStore.getState().user).toBeNull();
  });

  /* SET USER */

  describe("setUser", () => {

    it("sets user in state", () => {
      useAuthStore.getState().setUser(mockUser as any);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("clears user when called with null", () => {
      useAuthStore.setState({ user: mockUser as any });
      useAuthStore.getState().setUser(null);
      expect(useAuthStore.getState().user).toBeNull();
    });

  });

  /* LOGOUT */

  describe("logout", () => {

    it("calls POST /auth/logout", async () => {
      mockApi.post.mockResolvedValue({});
      await useAuthStore.getState().logout();
      expect(mockApi.post).toHaveBeenCalledWith("/auth/logout");
    });

    it("clears tokens after logout", async () => {
      mockApi.post.mockResolvedValue({});
      await useAuthStore.getState().logout();
      expect(mockClearTokens).toHaveBeenCalled();
    });

    it("sets user to null after logout", async () => {
      useAuthStore.setState({ user: mockUser as any });
      mockApi.post.mockResolvedValue({});
      await useAuthStore.getState().logout();
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("clears tokens even when API call fails", async () => {
      mockApi.post.mockRejectedValue(new Error("Network error"));
      await useAuthStore.getState().logout();
      expect(mockClearTokens).toHaveBeenCalled();
    });

    it("sets user to null even when API call fails", async () => {
      useAuthStore.setState({ user: mockUser as any });
      mockApi.post.mockRejectedValue(new Error("Network error"));
      await useAuthStore.getState().logout();
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("does not throw when API call fails", async () => {
      mockApi.post.mockRejectedValue(new Error("Network error"));
      await expect(useAuthStore.getState().logout()).resolves.toBeUndefined();
    });

  });

});