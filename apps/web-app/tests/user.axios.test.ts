// @vitest-environment jsdom
/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn()
}));

vi.mock("../src/api/axios", () => ({
  default: mockApi
}));

import { getUsers } from "../src/api/user.axios.js";

describe("Users API", () => {

  beforeEach(() => {
    mockApi.get.mockClear();
  });

  it("calls GET /auth/users and returns data", async () => {
    const mockUsers = [{ id: "1", email: "a@test.com" }, { id: "2", email: "b@test.com" }];
    mockApi.get.mockResolvedValue({ data: mockUsers });

    const result = await getUsers();

    expect(mockApi.get).toHaveBeenCalledWith("/auth/users");
    expect(result).toEqual(mockUsers);
  });

  it("returns empty array when no users exist", async () => {
    mockApi.get.mockResolvedValue({ data: [] });

    const result = await getUsers();

    expect(result).toEqual([]);
  });

});