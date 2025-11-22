import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Toolbar from "./Toolbar";
import Footer from "./Footer";

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F5F1EB] via-[#E8DDD4] to-[#F5F1EB]">
      {/* Toolbar - Fixed at very top */}
      <Toolbar />
      {/* Spacer to account for fixed toolbar */}
      <div className="h-16"></div>

      {/* Main Content - Fitted for laptop size */}
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <Outlet />
      </main>

      {/* Footer - Sticks to bottom */}
      <Footer />
    </div>
  );
}