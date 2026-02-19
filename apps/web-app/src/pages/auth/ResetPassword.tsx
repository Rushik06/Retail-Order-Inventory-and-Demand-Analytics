/*eslint-disable*/ 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { 
  isRequired, 
  isValidEmail, 
  minLength, 
  passwordsMatch 
} from "@/utils/validators";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");
    setMessage("");

    // VALIDATIONS FIRST

    if (
      !isRequired(form.email) ||
      !isRequired(form.otp) ||
      !isRequired(form.newPassword) ||
      !isRequired(confirmPassword)
    ) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!minLength(form.newPassword, 6)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!passwordsMatch(form.newPassword, confirmPassword)) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.patch("/password/reset", form);

      setMessage("Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {message && (
          <p className="text-green-600 text-sm mb-4 text-center">{message}</p>
        )}

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Registered Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={(e) =>
              setForm({ ...form, otp: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </div>
      </div>
    </div>
  );
}