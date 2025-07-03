// src/pages/VerifyOtp.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

export default function VerifyOtp() {
  const { state } = useLocation();
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.email) {
      setForm(prev => ({ ...prev, email: state.email }));
    }
  }, [state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", form);
      alert(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700">Verify OTP</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
          <input
            name="otp"
            type="text"
            value={form.otp}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="6-digit code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded transition duration-150 ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Verifying..." : "Reset Password"}
        </button>

        <div className="text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
