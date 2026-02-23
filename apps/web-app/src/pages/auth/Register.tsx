/*eslint-disable*/
import { useState } from "react";
import { registerUser } from "../../app/app.logic";
import { Link, useNavigate } from "react-router-dom";
import {
  isValidEmail,
  isRequired,
  minLength,
} from "../../utils/validators";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // CLIENT SIDE VALIDATION 
    if (!isRequired(form.name)) {
      return setError("Full name is required");
    }

    if (!isValidEmail(form.email)) {
      return setError("Please enter a valid email address");
    }

    if (!minLength(form.password, 6)) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      setError("");

      await registerUser(form.name, form.email, form.password);

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-blue-50 flex-col justify-center px-20">
        <h1 className="text-4xl font-bold text-gray-800">
          Join Retail Inventory
        </h1>
        <p className="mt-4 text-gray-600 max-w-md leading-relaxed">
          Manage Your Store Smarter
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-6">
        <div className="w-full max-w-md space-y-8">

          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Start managing your inventory today
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            <input
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-3 rounded-lg font-medium shadow-sm"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200" />
            OR
            <div className="flex-1 h-px bg-gray-200" />
          </div>


          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}