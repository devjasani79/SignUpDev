// src/pages/Reset.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/request-reset", { email });
      alert(res.data.message || "OTP sent to your email");
      navigate("/verify", { state: { email } }); // pre-fill email in next step
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-yellow-700">Reset Password</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded transition duration-150 ${
            loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
