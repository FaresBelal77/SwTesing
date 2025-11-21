import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import Toolbar from "./Toolbar";
import Footer from "./Footer";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(form);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EB]">
      <Toolbar />
      {/* Spacer to account for fixed toolbar */}
      <div className="h-10"></div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-[#E8DDD4] rounded-xl shadow-lg border-2 border-[#D4C4B0]">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#5C4A37]">Welcome! Please Register</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-[#5C4A37]">Name</label>
          <input
            placeholder="Enter your name"
            className="border-2 border-[#D4C4B0] bg-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] text-[#5C4A37]"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[#5C4A37]">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="border-2 border-[#D4C4B0] bg-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] text-[#5C4A37]"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[#5C4A37]">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="border-2 border-[#D4C4B0] bg-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] text-[#5C4A37]"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[#5C4A37]">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border-2 border-[#D4C4B0] bg-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] text-[#5C4A37]"
          >
            <option value="customer">Customer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C9B8A3] text-[#5C4A37] px-4 py-3 rounded-lg hover:bg-[#B8A692] disabled:bg-gray-400 font-medium transition-colors shadow-md"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#8B7355]">Already have an account?</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-2 text-[#8B7355] hover:text-[#6B5A47] hover:underline font-medium"
        >
          Login here
        </button>
      </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}