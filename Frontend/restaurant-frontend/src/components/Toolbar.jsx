import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Toolbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#8B7355] text-white fixed top-0 left-0 right-0 z-[9999] w-full h-16">
      <div className="w-full h-full px-6">
        <div className="flex justify-between items-center h-full">
          {/* Home Button - Left side */}
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-2 text-white font-medium text-sm hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-5 h-5 fill-current text-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-white">Home</span>
          </Link>

          {/* Logout Button - Right side */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-white font-medium text-sm hover:opacity-80 transition-opacity"
            >
              <span className="text-white">Logout</span>
              <svg
                className="w-5 h-5 fill-current text-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

