import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Toolbar from "./Toolbar";
import Footer from "./Footer";

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EB]">
      {/* Toolbar - Fixed at very top */}
      <Toolbar />
      {/* Spacer to account for fixed toolbar */}
      <div className="h-10"></div>

      {/* Header with Navigation */}
      <header className="bg-[#E8DDD4] text-[#5C4A37] shadow-md border-b border-[#D4C4B0]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center py-3">
            <h1 className="text-xl font-bold">Restaurant Portal</h1>

            {/* Navigation Bar */}
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/menu"
                    className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                  >
                    Menu
                  </Link>
                  {user.role === "customer" && (
                    <>
                      <Link
                        to="/reservations"
                        className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                      >
                        Reservations
                      </Link>
                      <Link
                        to="/orders"
                        className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/feedback"
                        className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                      >
                        Feedback
                      </Link>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <Link
                        to="/admin/orders"
                        className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                      >
                        All Orders
                      </Link>
                      <Link
                        to="/admin/reservations"
                        className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                      >
                        All Reservations
                      </Link>
                    </>
                  )}
                  <span className="text-xs font-medium px-2 py-1 bg-[#D4C4B0] rounded-md">
                    {user.name}
                  </span>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-md hover:bg-[#D4C4B0] transition-colors font-medium text-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Fitted for laptop size */}
      <main className="flex-1 p-4 container mx-auto max-w-7xl">
        <Outlet />
      </main>

      {/* Footer - Sticks to bottom */}
      <Footer />
    </div>
  );
}