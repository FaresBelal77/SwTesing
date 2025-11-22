import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-[#5C4A37]">
          Welcome to Our Restaurant
        </h1>
        <p className="text-xl text-[#8B7355]">
          {user
            ? `Hello, ${user.name}! Explore our menu and make a reservation.`
            : "Please login or register to get started."}
        </p>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Menu Block */}
          <Link
            to="/menu"
            className="bg-[#8B7355] text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm border border-white border-opacity-20"
          >
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-10 h-10 mx-auto fill-current text-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">View Menu</h2>
              <p className="text-white text-opacity-90 text-base">
                Browse our delicious menu items
              </p>
            </div>
          </Link>

          {user.role === "customer" && (
            <>
              {/* Reservations Block */}
              <Link
                to="/reservations"
                className="bg-[#8B7355] text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm border border-white border-opacity-20"
              >
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-10 h-10 mx-auto fill-current text-white"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">
                    Make Reservation
                  </h2>
                  <p className="text-white text-opacity-90 text-base">
                    Book a table for your visit
                  </p>
                </div>
              </Link>

              {/* Orders Block */}
              <Link
                to="/orders"
                className="bg-[#8B7355] text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm border border-white border-opacity-20"
              >
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-10 h-10 mx-auto fill-current text-white"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">My Orders</h2>
                  <p className="text-white text-opacity-90 text-base">
                    View and manage your orders
                  </p>
                </div>
              </Link>

              {/* Feedback Block */}
              <Link
                to="/feedback"
                className="bg-[#8B7355] text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm border border-white border-opacity-20"
              >
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-10 h-10 mx-auto fill-current text-white"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">
                    Submit Feedback
                  </h2>
                  <p className="text-white text-opacity-90 text-base">
                    Share your experience with us
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="text-center mt-12">
          <Link
            to="/login"
            className="bg-[#8B7355] text-white px-8 py-4 rounded-2xl hover:bg-[#6B5A47] transition-all duration-200 inline-block mr-4 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#8B7355] text-white px-8 py-4 rounded-2xl hover:bg-[#6B5A47] transition-all duration-200 inline-block text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

