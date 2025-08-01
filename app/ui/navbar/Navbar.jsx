"use client";
import React from "react";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // Just call logout - navigation is now handled in the AuthContext
    logout();
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md">
      {/* Left Section */}
      <div className="text-lg font-semibold text-[#800000]">Dashboard</div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-black" />
          <span className="text-blue-500 font-medium">
            {user ? `${user.first_name} ${user.last_name}` : 'User'}
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500 hover:text-red-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;