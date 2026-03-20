/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

/* vi.hoisted — Vitest 4.x requires `function` keyword (not arrow fn) for constructor mocks */

const mocks = vi.hoisted(() => ({
  AuthRepository: vi.fn(function () { return {}; }),
  AuthService: vi.fn(function () { return {}; }),
  AuthController: vi.fn(function () {
    return {
      register: vi.fn(function (req: any, res: any) {
        return res.status(201).json({ id: "1", email: "test@test.com" });
      }),
      login: vi.fn(function (req: any, res: any) {
        return res.status(200).json({ accessToken: "access-token", user: { id: "1" } });
      }),
      refresh: vi.fn(function (req: any, res: any) {
        return res.status(200).json({ accessToken: "new-access-token" });
      }),
      logout: vi.fn(function (req: any, res: any) {
        return res.status(200).json({ message: "Logged out successfully" });
      }),
      getUsers: vi.fn(function (req: any, res: any) {
        return res.status(200).json([{ id: "1", email: "a@test.com" }]);
      })
    };
  })
}));

/* MOCKS */

vi.mock("../src/repository/auth.repository.js", () => ({
  AuthRepository: mocks.AuthRepository
}));

vi.mock("../src/services/auth.service.js", () => ({
  AuthService: mocks.AuthService
}));

vi.mock("../src/controller/auth.controller.js", () => ({
  AuthController: mocks.AuthController
}));

vi.mock("../src/middleware/validate.middleware.js", () => ({
  validate: () => (req: any, res: any, next: any) => next()
}));

vi.mock("../src/middleware/auth.middleware.js", () => ({
  authenticate: (req: any, res: any, next: any) => next()
}));

vi.mock("../src/middleware/rbac.middleware.js", () => ({
  authorizeRole: () => (req: any, res: any, next: any) => next()
}));

vi.mock("../src/validation/auth.schema.js", () => ({
  registerSchema: {},
  loginSchema: {}
}));

/* import after mocks */

import router from "../src/routes/auth.routes.js";

describe("Auth Routes", () => {

  let app: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/auth", router);
    vi.clearAllMocks();
  });

  it("POST /api/auth/register should register user", async () => {

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "John", email: "test@test.com", password: "pass123" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "1", email: "test@test.com" });

  });

  it("POST /api/auth/login should login user", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "pass123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("user");

  });

  it("POST /api/auth/refresh should return new accessToken", async () => {

    const res = await request(app).post("/api/auth/refresh");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");

  });

  it("POST /api/auth/logout should logout successfully", async () => {

    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Logged out successfully" });

  });

  it("GET /api/auth/users should return list of users", async () => {

    const res = await request(app).get("/api/auth/users");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "1", email: "a@test.com" }]);

  });

});