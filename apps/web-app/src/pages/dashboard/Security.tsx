/*eslint-disable*/ 
import { useState } from "react";
import api from "@/api/axios";

export default function Security() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setError("");
    setMessage("");

    // Basic validation
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return setError("All fields are required");
    }

    if (form.newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
      setLoading(true);

      await api.patch("/password/change", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMessage("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Security Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Change your account password securely
        </p>
      </div>

      {/* Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm border border-green-200">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Updating Password..." : "Update Password"}
        </button>

      </div>
    </div>
  );
}