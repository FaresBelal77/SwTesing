import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Toolbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleInfoClick = () => {
    alert("Restaurant Portal - Your one-stop destination for dining reservations, orders, and feedback!");
  };

  return (
    <div className="bg-[#3D2F1F] text-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Right side - Info icon and Logout (if logged in) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleInfoClick}
              className="text-white hover:opacity-75 transition-opacity p-1"
              aria-label="Information"
              title="About Restaurant Portal"
            >
              <svg
                className="w-3.5 h-3.5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="text-white hover:opacity-75 transition-opacity text-sm font-medium px-2 py-1"
              >
                Logout
              </button>
            )}
          </div>

          {/* Left side - Home button */}
          <Link
            to="/"
            className="flex items-center space-x-1 hover:opacity-75 transition-opacity text-white"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

