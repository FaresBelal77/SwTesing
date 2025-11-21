import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Toolbar from "./Toolbar";
import Footer from "./Footer";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const success = await login(form);
    setLoading(false);
    
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EB]">
      <Toolbar />
      {/* Spacer to account for fixed toolbar */}
      <div className="h-10"></div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-[#E8DDD4] rounded-xl shadow-lg border-2 border-[#D4C4B0]">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#5C4A37]">Welcome! Please Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-[#5C4A37]">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border-2 border-[#D4C4B0] bg-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] text-[#5C4A37]"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[#5C4A37]">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border-2 border-[#D4C4B0] bg-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] text-[#5C4A37]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8B7355] text-white px-4 py-3 rounded-lg hover:bg-[#6B5A47] disabled:bg-gray-400 font-medium transition-colors shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#8B7355]">Don't have an account?</p>
        <button
          onClick={() => navigate("/register")}
          className="mt-2 text-[#8B7355] hover:text-[#6B5A47] hover:underline font-medium"
        >
          Register here
        </button>
      </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}