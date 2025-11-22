import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount and verify it
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Verify token is still valid by calling /me endpoint
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Try to verify token with backend
        authAPI.getMe()
          .then((response) => {
            if (response.data.user) {
              // Token is valid, update user data
              const freshUser = response.data.user;
              setUser(freshUser);
              localStorage.setItem("user", JSON.stringify(freshUser));
            } else {
              // Invalid token, clear storage
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              delete axios.defaults.headers.common["Authorization"];
            }
          })
          .catch((error) => {
            console.error("Token verification failed:", error);
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Attempting login with credentials:", { email: credentials.email });
      const response = await authAPI.login(credentials);
      
      console.log("Full login response:", response); // Debug log
      console.log("Login response data:", response.data); // Debug log
      
      // Check for token and user in response
      const token = response.data.token;
      const userData = response.data.user;
      
      if (token && userData) {
        console.log("User data from login:", userData); // Debug log
        console.log("User role:", userData.role); // Debug log
        
        // Store token and user
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Update user state immediately
        setUser(userData);
        
        // Force a synchronous state update by reading from localStorage
        // This ensures the state is available immediately
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Stored user in localStorage:", storedUser); // Debug log
        console.log("User state should be updated now"); // Debug log
        
        console.log("Login successful, user role:", userData.role); // Debug log
        return { success: true, user: userData };
      }
      console.error("Invalid response format - missing token or user:", response.data);
      return { success: false, message: "Invalid response from server" };
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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

