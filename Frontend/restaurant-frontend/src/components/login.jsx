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
    <div className="min-h-screen flex flex-col relative pt-16">
      <Toolbar />
      {/* Blurred background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8DDD4] via-[#F5F1EB] to-[#E8DDD4] opacity-90 blur-sm -z-10"></div>
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 min-h-[calc(100vh-4rem)]">
        <div className="max-w-lg w-full p-12 bg-[#5C4A37] rounded-3xl shadow-2xl">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">THE NEST BISTRO</h1>
          </div>
      
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl border border-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="USERNAME"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-[#F5F1EB] border-2 border-[#8B7355] p-5 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C4B0] focus:border-[#D4C4B0] text-[#5C4A37] placeholder:text-gray-600 placeholder:font-light transition-all duration-200 text-lg"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="PASSWORD"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-[#F5F1EB] border-2 border-[#8B7355] p-5 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C4B0] focus:border-[#D4C4B0] text-[#5C4A37] placeholder:text-gray-600 placeholder:font-light transition-all duration-200 text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5F1EB] text-[#5C4A37] px-4 py-5 rounded-xl hover:bg-[#E8DDD4] disabled:bg-gray-400 font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-xl transform hover:-translate-y-0.5 mt-4"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-base text-white hover:text-[#F5F1EB] cursor-pointer transition-colors">Forgot Password?</p>
            <p className="text-base text-white">
              New user?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#F5F1EB] hover:text-white hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}