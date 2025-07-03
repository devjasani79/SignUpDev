import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-700">Register</h2>
        <div>
          <label className="block text-gray-600 mb-1">Name</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Register
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-green-600 hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
