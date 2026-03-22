// @vitest-environment jsdom
/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const tokenMocks = vi.hoisted(() => ({
  getAccessToken: vi.fn(),
  setAccessToken: vi.fn(),
  clearTokens: vi.fn()
}));

let reqHandler: any = null;
let resFulfilled: any = null;
let resRejected: any = null;
let apiInstance: any = null;

vi.mock("../src/utils/token", () => ({
  getAccessToken: tokenMocks.getAccessToken,
  setAccessToken: tokenMocks.setAccessToken,
  clearTokens: tokenMocks.clearTokens
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(function () {
      apiInstance = vi.fn();
      apiInstance.interceptors = {
        request:  { use: vi.fn(function (h: any) { reqHandler = h; }) },
        response: { use: vi.fn(function (ok: any, err: any) { resFulfilled = ok; resRejected = err; }) }
      };
      return apiInstance;
    }),
    post: vi.fn()
  }
}));

import axios from "axios";
import { createApiClient } from "../src/api/api-client.js";

const URLS = {
  auth:      "http://localhost:3000",
  products:  "http://localhost:3001",
  inventory: "http://localhost:3002",
  reporting: "http://localhost:3003"
};

const make401 = (url: string, retry = false) => ({
  response: { status: 401 },
  config: { url, headers: {}, _retry: retry }
});

describe("createApiClient", () => {

  beforeEach(() => {
    tokenMocks.getAccessToken.mockClear();
    tokenMocks.setAccessToken.mockClear();
    tokenMocks.clearTokens.mockClear();
    (axios.create as any).mockClear();
    (axios.post as any).mockClear();

    reqHandler = resFulfilled = resRejected = apiInstance = null;

    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "/" }
    });
  });

  /* FACTORY */

  it("creates instance with correct baseURL and withCredentials", () => {
    createApiClient(URLS.products);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: URLS.products,
      withCredentials: true
    });
  });

  it("works with all service URLs", () => {
    Object.values(URLS).forEach(url => {
      (axios.create as any).mockClear();
      createApiClient(url);
      expect(axios.create).toHaveBeenCalledWith({ baseURL: url, withCredentials: true });
    });
  });

  it("registers request + response interceptors", () => {
    createApiClient(URLS.products);
    expect(apiInstance.interceptors.request.use).toHaveBeenCalled();
    expect(apiInstance.interceptors.response.use).toHaveBeenCalled();
  });

  /* REQUEST INTERCEPTOR */

  describe("request interceptor", () => {

    it("attaches Authorization header when token exists", () => {
      tokenMocks.getAccessToken.mockReturnValue("my-token");
      createApiClient(URLS.products);
      const result = reqHandler({ headers: {} });
      expect(result.headers.Authorization).toBe("Bearer my-token");
    });

    it("skips Authorization header when no token", () => {
      tokenMocks.getAccessToken.mockReturnValue(null);
      createApiClient(URLS.products);
      const result = reqHandler({ headers: {} });
      expect(result.headers.Authorization).toBeUndefined();
    });

  });

  /* RESPONSE INTERCEPTOR */

  describe("response interceptor", () => {

    it("passes successful responses through unchanged", async () => {
      createApiClient(URLS.products);
      const res = { data: {}, status: 200 };
      expect(await resFulfilled(res)).toEqual(res);
    });

    it("refreshes token and retries on 401", async () => {
      createApiClient(URLS.products);
      (axios.post as any).mockResolvedValue({ data: { accessToken: "new-token" } });
      apiInstance.mockResolvedValue({ status: 200 });

      await resRejected(make401("/api/products"));

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/auth/refresh"),
        {},
        { withCredentials: true }
      );
      expect(tokenMocks.setAccessToken).toHaveBeenCalledWith("new-token");
    });

    it("sets Authorization on original request before retry", async () => {
      createApiClient(URLS.products);
      (axios.post as any).mockResolvedValue({ data: { accessToken: "fresh-token" } });
      apiInstance.mockResolvedValue({ status: 200 });

      const config: any = { url: "/api/products", headers: {}, _retry: false };
      await resRejected({ response: { status: 401 }, config });

      expect(config.headers.Authorization).toBe("Bearer fresh-token");
    });

    it("clears tokens and redirects to /login when refresh fails", async () => {
      createApiClient(URLS.products);
      (axios.post as any).mockRejectedValue(new Error("Refresh failed"));

      await resRejected(make401("/api/products")).catch(() => {});

      expect(tokenMocks.clearTokens).toHaveBeenCalled();
      expect(window.location.href).toBe("/login");
    });

    it("does not retry when _retry is already true", async () => {
      createApiClient(URLS.products);
      const err = make401("/api/products", true);
      await expect(resRejected(err)).rejects.toEqual(err);
      expect(axios.post).not.toHaveBeenCalled();
    });

    it.each([
      "/auth/login",
      "/auth/register",
      "/password/forgot",
      "/password/reset"
    ])("does not retry on auth route: %s", async (url) => {
      createApiClient(URLS.auth);
      const err = make401(url);
      await expect(resRejected(err)).rejects.toEqual(err);
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("does not retry on non-401 errors", async () => {
      createApiClient(URLS.inventory);
      const err = { response: { status: 500 }, config: { url: "/api/inventory", headers: {}, _retry: false } };
      await expect(resRejected(err)).rejects.toEqual(err);
      expect(axios.post).not.toHaveBeenCalled();
    });

  });

});