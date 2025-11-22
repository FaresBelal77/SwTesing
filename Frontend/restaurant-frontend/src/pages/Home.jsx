import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import "../Home.css";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">
          Welcome to Our Restaurant
        </h1>
        <p className="home-subtitle">
          {user
            ? user.role === "admin"
              ? `Hello, ${user.name}! Manage the restaurant.`
              : `Hello, ${user.name}! Explore our menu and make a reservation.`
            : "Please login or register to get started."}
        </p>
      </div>

      {user ? (
        <div className="home-grid">
          {user.role === "admin" ? (
            <>
              {/* Admin Menu Management */}
              <Link to="/admin/menu" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                  </svg>
                  <h2 className="home-card-title">Manage Menu</h2>
                  <p className="home-card-description">
                    Add, edit, or delete menu items
                  </p>
                </div>
              </Link>

              {/* Admin Reservations */}
              <Link to="/admin/reservations" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                  </svg>
                  <h2 className="home-card-title">
                    Manage Reservations
                  </h2>
                  <p className="home-card-description">
                    View and update all reservations
                  </p>
                </div>
              </Link>

              {/* Admin Orders */}
              <Link to="/admin/orders" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  <h2 className="home-card-title">Manage Orders</h2>
                  <p className="home-card-description">
                    View and update all orders
                  </p>
                </div>
              </Link>

              {/* Admin Feedback */}
              <Link to="/admin/feedback" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                  <h2 className="home-card-title">
                    View Feedback
                  </h2>
                  <p className="home-card-description">
                    View all customer feedback
                  </p>
                </div>
              </Link>
            </>
          ) : (
            <>
              {/* Menu Block */}
              <Link to="/menu" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                  </svg>
                  <h2 className="home-card-title">View Menu</h2>
                  <p className="home-card-description">
                    Browse our delicious menu items
                  </p>
                </div>
              </Link>

              {/* Reservations Block */}
              <Link to="/reservations" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                  </svg>
                  <h2 className="home-card-title">
                    Make Reservation
                  </h2>
                  <p className="home-card-description">
                    Book a table for your visit
                  </p>
                </div>
              </Link>

              {/* Orders Block */}
              <Link to="/orders" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  <h2 className="home-card-title">My Orders</h2>
                  <p className="home-card-description">
                    View and manage your orders
                  </p>
                </div>
              </Link>

              {/* Feedback Block */}
              <Link to="/feedback" className="home-card">
                <div className="home-card-content">
                  <svg
                    className="home-card-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                  <h2 className="home-card-title">
                    Submit Feedback
                  </h2>
                  <p className="home-card-description">
                    Share your experience with us
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="home-auth-container">
          <Link to="/login" className="home-auth-button">
            Login
          </Link>
          <Link to="/register" className="home-auth-button">
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

