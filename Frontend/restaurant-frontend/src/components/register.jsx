import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Auth.css";
import "../Register.css";

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
    <div className="register-page">
      <Navbar />
      <div className="register-background"></div>
      <div className="register-container">
        <div className="register-card">
          {/* Title */}
          <div className="register-title">
            <h1>THE NEST BISTRO</h1>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {message && (
            <div className="register-success">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div style={{ position: "relative" }}>
              <svg
                className="auth-icon"
                viewBox="0 0 24 24"
                style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <input
                placeholder="NAME"
                className="register-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div style={{ position: "relative" }}>
              <svg
                className="auth-icon"
                viewBox="0 0 24 24"
                style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input
                type="email"
                placeholder="EMAIL"
                className="register-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ position: "relative" }}>
              <svg
                className="auth-icon"
                viewBox="0 0 24 24"
                style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <input
                type="password"
                placeholder="PASSWORD"
                className="register-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="admin-label">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="register-select"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="register-button"
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </form>

          <div className="register-bottom">
            <p className="register-bottom-text">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="register-link"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}