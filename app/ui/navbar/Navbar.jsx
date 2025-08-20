"use client";
import React from "react";
import { User, LogOut, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // Just call logout - navigation is now handled in the AuthContext
    logout();
  };

  const pathname = usePathname();
  const isDashboardIndex = pathname === "/dashboard";

  const getPageName = () => {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length > 1
    ? parts[parts.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Dashboard";
  };


  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Left Section */}
      <div>
        {isDashboardIndex ? (
      <>
        <h1 className="text-lg font-medium text-[#7F375E]">Dashboard</h1>
        <p className="w-80 h-7 justify-start text-stone-900 text-lg font-bold font-['Poppins'] leading-normal">
          👋🏾 Welcome Back,{" "}
          <span className="text-[#29AAE1]">
            {user ? `${user.first_name} ${user.last_name}` : "User"}
          </span>
        </p>
      </>
    ) : (
      <h1 className="text-lg font-medium text-[#7F375E]">{getPageName()}</h1>
    )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-500" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#5f6062]">
              {user ? `${user.first_name} ${user.last_name}` : 'User'}
            </span>
              <span className="text-xs text-gray-500">
              {user
                ? user.roles.find((role) => role?.name === "admin")?.name || ""
                : ""}
              </span>
          </div>
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