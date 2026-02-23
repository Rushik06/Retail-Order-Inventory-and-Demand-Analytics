/*eslint-disable*/
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { useAuthStore } from "@/app/app.state";
import { isRequired, isValidEmail } from "@/utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Client-side validation
    if (!isRequired(form.email) || !isRequired(form.password)) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/auth/login", form);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      setUser(res.data.user);
      navigate("/dashboard");

    } catch (err: any) {

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4">

      <form
        noValidate
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Retail Inventory
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Manage your store smarter
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-5 text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1">
            Email address
          </label>
          <input
            type="text"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer Links */}
        <div className="mt-8 space-y-3 text-sm text-center">

          <Link
            to="/forgot-password"
            className="block text-gray-500 hover:text-blue-600 transition"
          >
            Forgot your password?
          </Link>

          <div className="text-gray-500">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Create one
            </Link>
          </div>

        </div>

      </form>
    </div>
  );
}