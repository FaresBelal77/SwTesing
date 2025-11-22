import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../Login.css";
import "../Auth.css";


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    // Trim email and password to remove any whitespace
    const trimmedCredentials = {
      email: form.email.trim(),
      password: form.password.trim()
    };

    try {
      const result = await login(trimmedCredentials);
      setLoading(false);

      console.log("Login result:", result); // Debug log

      if (result.success && result.user) {
        console.log("Login successful, user role:", result.user.role);
        // Navigate immediately - routes will check localStorage if state isn't ready
        // Use a small delay to ensure localStorage is written
        setTimeout(() => {
          if (result.user.role === "admin") {
            console.log("Admin login detected, redirecting to /admin/menu");
            navigate("/admin/menu", { replace: true });
          } else {
            console.log("Regular user login, redirecting to /");
            navigate("/", { replace: true });
          }
        }, 50);
      } else {
        console.error("Login failed:", result);
        setError(result.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">THE NEST BISTRO</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ position: "relative" }}>
            <svg
              className="auth-icon"
              viewBox="0 0 24 24"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <input
              type="email"
              placeholder="EMAIL"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="auth-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <svg
              className="auth-icon"
              viewBox="0 0 24 24"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
            >
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <input
              type="password"
              placeholder="PASSWORD"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="auth-input"
              style={{ paddingLeft: "44px" }}
            />
          </div>

          <button type="submit" className="auth-button">
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <p className="auth-link">Forgot Password?</p>

        <p className="auth-bottom">
          New user?{" "}
          <span
            className="auth-text-button"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
