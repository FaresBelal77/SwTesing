import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Layout from "./components/layout";
import LoginForm from "./components/login";
import RegisterForm from "./components/register";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import Orders from "./pages/Orders";
import Feedback from "./pages/Feedback";
import AdminMenu from "./pages/AdminMenu";
import AdminReservations from "./pages/AdminReservations";
import AdminOrders from "./pages/AdminOrders";
import AdminFeedback from "./pages/AdminFeedback";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Admin Route Component
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Public Route Component (redirects to home if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="orders" element={<Orders />} />
        <Route path="feedback" element={<Feedback />} />
        
        {/* Admin Routes */}
        <Route
          path="admin/menu"
          element={
            <AdminRoute>
              <AdminMenu />
            </AdminRoute>
          }
        />
        <Route
          path="admin/reservations"
          element={
            <AdminRoute>
              <AdminReservations />
            </AdminRoute>
          }
        />
        <Route
          path="admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="admin/feedback"
          element={
            <AdminRoute>
              <AdminFeedback />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
