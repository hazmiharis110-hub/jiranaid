import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Plus, Wrench } from "lucide-react";
import { authService } from "../services/authService";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check authentication status on mount & setup listener for changes
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token =
        localStorage.getItem("jiranaid_token") || localStorage.getItem("token");

      if (storedUser && token) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes across tabs or custom dispatch events
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-black text-xl text-black"
        >
          <div className="p-1.5 bg-[#ffc900] border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
            <Wrench className="w-5 h-5 text-black" />
          </div>
          <span>JiranAid</span>
        </Link>

        {/* Dynamic Navigation Options */}
        <div className="flex items-center gap-3">
          <Link
            to="/items"
            className="text-xs sm:text-sm font-black text-black hover:underline px-2 py-1"
          >
            Browse Tools
          </Link>

          {currentUser ? (
            /* SIGNED IN VIEW */
            <div className="flex items-center gap-3">
              <Link
                to="/items/create"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ffc900] text-black border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">List Equipment</span>
              </Link>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000]">
                <User className="w-4 h-4 text-black" />
                <span>
                  {currentUser.name || currentUser.email?.split("@")[0]}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-black" />
              </button>
            </div>
          ) : (
            /* SIGNED OUT VIEW */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl bg-white text-black border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000] hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl bg-[#ffc900] text-black border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000] hover:bg-[#ffbe00] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Join Circle
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
