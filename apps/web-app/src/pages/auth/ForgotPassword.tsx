/*eslint-disable*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { isRequired, isValidEmail } from "@/utils/validators";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //CLIENT SIDE VALIDATION
    if (!isRequired(email)) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await api.post("/password/forgot", { email });

      setMessage("OTP sent successfully to your email");

      // Smooth redirect after success
      setTimeout(() => {
        navigate(`/reset-password?email=${email}`);
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-96 space-y-6 border border-slate-200"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Forgot Password
        </h2>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Enter your email"
          className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}