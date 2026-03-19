/*eslint-disable*/
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";

/* vi.hoisted — runs BEFORE vi.mock, so mockService is safe to reference in factories */

const mockService = vi.hoisted(() => ({
  changePassword: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn()
}));

/* MOCK AUTH MIDDLEWARE */

vi.mock("../src/middleware/auth.middleware.js", () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  }
}));

/* MOCK VALIDATE MIDDLEWARE */

vi.mock("../src/middleware/validate.middleware.js", () => ({
  validate: () => (_req: any, _res: any, next: any) => next()
}));

/* MOCK VALIDATION SCHEMAS */

vi.mock("../src/validation/password.schema.js", () => ({
  changePasswordSchema: {},
  forgotPasswordSchema: {},
  resetPasswordSchema: {}
}));

/* MOCK REPOSITORY */

vi.mock("../src/repository/password.repository.js", () => ({
  PasswordRepository: vi.fn().mockImplementation(() => ({}))
}));

/* MOCK PASSWORD SERVICE */

vi.mock("../src/services/password.service.js", () => ({
  PasswordService: vi.fn().mockImplementation(() => mockService)
}));

/* import after mocks */

import passwordRoutes from "../src/routes/password.routes.js";

describe("Password Routes", () => {

  const app = express();
  app.use(express.json());
  app.use("/api/password", passwordRoutes);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CHANGE PASSWORD */

  it("PATCH /change - success", async () => {

    mockService.changePassword.mockResolvedValue({
      message: "Password changed successfully"
    });

    const res = await request(app)
      .patch("/api/password/change")
      .set("Authorization", "Bearer token")
      .send({
        currentPassword: "old",
        newPassword: "new"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Password changed successfully" });
    expect(mockService.changePassword).toHaveBeenCalledWith(
      "user-123",
      "old",
      "new"
    );

  });

  it("PATCH /change - error returns 400", async () => {

    mockService.changePassword.mockRejectedValue(
      Object.assign(new Error("INVALID_CURRENT_PASSWORD"), { statusCode: 400 })
    );

    const res = await request(app)
      .patch("/api/password/change")
      .set("Authorization", "Bearer token")
      .send({ currentPassword: "wrong", newPassword: "new" });

    expect(res.status).toBe(400);

  });

  /* FORGOT PASSWORD */

  it("POST /forgot - success", async () => {

    mockService.forgotPassword.mockResolvedValue({
      message: "OTP sent to registered email"
    });

    const res = await request(app)
      .post("/api/password/forgot")
      .send({ email: "test@test.com" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "OTP sent to registered email" });
    expect(mockService.forgotPassword).toHaveBeenCalledWith("test@test.com");

  });

  it("POST /forgot - error returns 400", async () => {

    mockService.forgotPassword.mockRejectedValue(
      Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
    );

    const res = await request(app)
      .post("/api/password/forgot")
      .send({ email: "ghost@test.com" });

    expect(res.status).toBe(404);

  });

  /* RESET PASSWORD */

  it("PATCH /reset - success", async () => {

    mockService.resetPassword.mockResolvedValue({
      message: "Password reset successfully"
    });

    const res = await request(app)
      .patch("/api/password/reset")
      .send({
        email: "test@test.com",
        otp: "123456",
        newPassword: "newpass"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Password reset successfully" });
    expect(mockService.resetPassword).toHaveBeenCalledWith(
      "test@test.com",
      "123456",
      "newpass"
    );

  });

  it("PATCH /reset - error returns 400", async () => {

    mockService.resetPassword.mockRejectedValue(
      Object.assign(new Error("INVALID_OTP"), { statusCode: 400 })
    );

    const res = await request(app)
      .patch("/api/password/reset")
      .send({
        email: "test@test.com",
        otp: "000000",
        newPassword: "newpass"
      });

    expect(res.status).toBe(400);

  });

});