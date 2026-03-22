/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn()
}));

vi.mock("../src/api/axios", () => ({
  default: mockApi
}));

import { assignRole, getAdminOnly, getSuperAdminOnly } from "../src/api/rbac.axios.js";

describe("RBAC API", () => {

  beforeEach(() => {
    mockApi.get.mockClear();
    mockApi.post.mockClear();
  });

  it("assignRole calls POST /rbac/assign-role and returns data", async () => {
    mockApi.post.mockResolvedValue({ data: { success: true } });

    const result = await assignRole("user-1", "admin");

    expect(mockApi.post).toHaveBeenCalledWith("/rbac/assign-role", {
      userId: "user-1",
      roleName: "admin"
    });
    expect(result).toEqual({ success: true });
  });

  it("getAdminOnly calls GET /rbac/admin-only and returns data", async () => {
    mockApi.get.mockResolvedValue({ data: { message: "admin access" } });

    const result = await getAdminOnly();

    expect(mockApi.get).toHaveBeenCalledWith("/rbac/admin-only");
    expect(result).toEqual({ message: "admin access" });
  });

  it("getSuperAdminOnly calls GET /rbac/super-admin-only and returns data", async () => {
    mockApi.get.mockResolvedValue({ data: { message: "super admin access" } });

    const result = await getSuperAdminOnly();

    expect(mockApi.get).toHaveBeenCalledWith("/rbac/super-admin-only");
    expect(result).toEqual({ message: "super admin access" });
  });

});