/*eslint-disable*/
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";

/* vi.hoisted — Vitest 4.x requires `function` keyword for constructor mocks */

const mocks = vi.hoisted(() => {
  const service = {
    changePassword: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn()
  };

  return {
    service,
    PasswordRepository: vi.fn(function () { return {}; }),
    PasswordService: vi.fn(function () { return service; }),
    PasswordController: vi.fn(function () {
      return {
        changePassword: async function (req: any, res: any) {
          const result = await service.changePassword(
            req.user.id,
            req.body.currentPassword,
            req.body.newPassword
          );
          return res.status(200).json(result);
        },
        forgotPassword: async function (req: any, res: any) {
          const result = await service.forgotPassword(req.body.email);
          return res.status(200).json(result);
        },
        resetPassword: async function (req: any, res: any) {
          const result = await service.resetPassword(
            req.body.email,
            req.body.otp,
            req.body.newPassword
          );
          return res.status(200).json(result);
        }
      };
    })
  };
});

/* MOCKS */

vi.mock("../src/repository/password.repository.js", () => ({
  PasswordRepository: mocks.PasswordRepository
}));

vi.mock("../src/services/password.service.js", () => ({
  PasswordService: mocks.PasswordService
}));

vi.mock("../src/controllers/password.controller.js", () => ({
  PasswordController: mocks.PasswordController
}));

vi.mock("../src/middleware/auth.middleware.js", () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  }
}));

vi.mock("../src/middleware/validate.middleware.js", () => ({
  validate: () => (_req: any, _res: any, next: any) => next()
}));

vi.mock("../src/validation/password.schema.js", () => ({
  changePasswordSchema: {},
  forgotPasswordSchema: {},
  resetPasswordSchema: {}
}));

/* import after mocks */

import passwordRoutes from "../src/routes/password.routes.js";

describe("Password Routes", () => {

  let app: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/password", passwordRoutes);
    app.use((err: any, _req: any, res: any, _next: any) => {
      res.status(err.statusCode ?? 500).json({ message: err.message });
    });
    vi.clearAllMocks();
  });

  /* CHANGE PASSWORD */

  it("PATCH /change - success", async () => {

    mocks.service.changePassword.mockResolvedValue({
      message: "Password changed successfully"
    });

    const res = await request(app)
      .patch("/api/password/change")
      .set("Authorization", "Bearer token")
      .send({ currentPassword: "old", newPassword: "new" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Password changed successfully" });
    expect(mocks.service.changePassword).toHaveBeenCalledWith("user-123", "old", "new");

  });

  it("PATCH /change - error returns 400", async () => {

    mocks.service.changePassword.mockRejectedValue(
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

    mocks.service.forgotPassword.mockResolvedValue({
      message: "OTP sent to registered email"
    });

    const res = await request(app)
      .post("/api/password/forgot")
      .send({ email: "test@test.com" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "OTP sent to registered email" });
    expect(mocks.service.forgotPassword).toHaveBeenCalledWith("test@test.com");

  });

  it("POST /forgot - error returns 404", async () => {

    mocks.service.forgotPassword.mockRejectedValue(
      Object.assign(new Error("USER_NOT_FOUND"), { statusCode: 404 })
    );

    const res = await request(app)
      .post("/api/password/forgot")
      .send({ email: "ghost@test.com" });

    expect(res.status).toBe(404);

  });

  /* RESET PASSWORD */

  it("PATCH /reset - success", async () => {

    mocks.service.resetPassword.mockResolvedValue({
      message: "Password reset successfully"
    });

    const res = await request(app)
      .patch("/api/password/reset")
      .send({ email: "test@test.com", otp: "123456", newPassword: "newpass" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Password reset successfully" });
    expect(mocks.service.resetPassword).toHaveBeenCalledWith(
      "test@test.com", "123456", "newpass"
    );

  });

  it("PATCH /reset - error returns 400", async () => {

    mocks.service.resetPassword.mockRejectedValue(
      Object.assign(new Error("INVALID_OTP"), { statusCode: 400 })
    );

    const res = await request(app)
      .patch("/api/password/reset")
      .send({ email: "test@test.com", otp: "000000", newPassword: "newpass" });

    expect(res.status).toBe(400);

  });

});