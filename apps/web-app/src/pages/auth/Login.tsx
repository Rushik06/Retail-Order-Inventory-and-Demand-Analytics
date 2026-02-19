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
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4">

      <form
        noValidate
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-8"
      >

        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Retail Inventory
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your store smarter
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href =
              "http://localhost:3000/api/auth/google";
          }}
          className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer Links */}
        <div className="flex justify-between mt-6 text-sm">
          <Link
            to="/forgot-password"
            className="text-gray-500 hover:text-blue-600"
          >
            Forgot password?
          </Link>

          <Link
            to="/register"
            className="text-gray-500 hover:text-blue-600"
          >
            Create account
          </Link>
        </div>

      </form>
    </div>
  );
}