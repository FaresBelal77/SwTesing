import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Set default axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.token && response.data.user) {
        const { token, user: userData } = response.data;
        
        // Store token and user
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: "Invalid response from server" };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

