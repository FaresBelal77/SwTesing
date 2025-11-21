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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Menu Block */}
          <Link
            to="/menu"
            className="bg-[#E8DDD4] p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#D4C4B0] hover:border-[#C9B8A3] transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto fill-current text-[#8B7355]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-[#5C4A37]">View Menu</h2>
              <p className="text-[#8B7355] text-lg">
                Browse our delicious menu items
              </p>
            </div>
          </Link>

          {user.role === "customer" && (
            <>
              {/* Reservations Block */}
              <Link
                to="/reservations"
                className="bg-[#E8DDD4] p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#D4C4B0] hover:border-[#C9B8A3] transform hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 mx-auto fill-current text-[#8B7355]"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-[#5C4A37]">
                    Make Reservation
                  </h2>
                  <p className="text-[#8B7355] text-lg">
                    Book a table for your visit
                  </p>
                </div>
              </Link>

              {/* Orders Block */}
              <Link
                to="/orders"
                className="bg-[#E8DDD4] p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#D4C4B0] hover:border-[#C9B8A3] transform hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 mx-auto fill-current text-[#8B7355]"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-[#5C4A37]">My Orders</h2>
                  <p className="text-[#8B7355] text-lg">
                    View and manage your orders
                  </p>
                </div>
              </Link>

              {/* Feedback Block */}
              <Link
                to="/feedback"
                className="bg-[#E8DDD4] p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#D4C4B0] hover:border-[#C9B8A3] transform hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 mx-auto fill-current text-[#8B7355]"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-1.51l1.41-1.41c.31.31.81.78 1.27 1.05.46.27.94.4 1.4.4.55 0 1-.45 1-1s-.45-1-1-1c-.28 0-.5.11-.71.3-.21.19-.3.45-.3.71h-2.01c0-.57.21-1.1.59-1.49.37-.39.88-.61 1.42-.61.55 0 1 .45 1 1h2.01c0-1.1-.9-2-2-2-.83 0-1.54.5-1.85 1.21l-1.4-1.41c.51-.93 1.36-1.64 2.25-1.95V9h2.67v1.95c.89.31 1.74 1.02 2.25 1.95l-1.4 1.41c-.31-.71-1.02-1.21-1.85-1.21-.55 0-1 .45-1 1s.45 1 1 1c.28 0 .5-.11.71-.3.21-.19.3-.45.3-.71h2.01c0 .57-.21 1.1-.59 1.49-.37.39-.88.61-1.42.61-.83 0-1.54-.5-1.85-1.21l1.4-1.41c-.51-.93-1.36-1.64-2.25-1.95V4h-2.67v1.93c-1.71.36-3.16 1.46-3.27 1.51l-1.41-1.41c.31-.31.81-.78 1.27-1.05.46-.27.94-.4 1.4-.4.55 0 1 .45 1 1s-.45 1-1 1c-.28 0-.5-.11-.71-.3-.21-.19-.3-.45-.3-.71H8.5c0 1.1.9 2 2 2 .83 0 1.54-.5 1.85-1.21l1.4 1.41c-.51.93-1.36 1.64-2.25 1.95V20h2.67v-1.95c.89-.31 1.74-1.02 2.25-1.95l1.4 1.41c-.31.71-1.02 1.21-1.85 1.21-.55 0-1-.45-1-1s.45-1 1-1c.28 0 .5.11.71.3.21.19.3.45.3.71h2.01c0-.57.21-1.1.59-1.49.37-.39.88-.61 1.42-.61.83 0 1.54.5 1.85 1.21l-1.4 1.41c-.51-.93-1.36-1.64-2.25-1.95z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-[#5C4A37]">
                    Submit Feedback
                  </h2>
                  <p className="text-[#8B7355] text-lg">
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
            className="bg-[#8B7355] text-white px-8 py-4 rounded-lg hover:bg-[#6B5A47] transition-colors inline-block mr-4 text-lg font-medium shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#C9B8A3] text-[#5C4A37] px-8 py-4 rounded-lg hover:bg-[#B8A692] transition-colors inline-block text-lg font-medium shadow-md"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

