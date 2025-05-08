"use client";
import React, { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { authAPI } from "../../utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Navbar = () => {
  const [username, setUsername] = useState("Admin");
  const router = useRouter();

  const handleLogout = () => {
    authAPI.logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md">
      {/* Left Section */}
      <div className="text-lg font-semibold text-[#800000]">Dashboard</div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-black" />
          <span className="text-blue-500 font-medium">{username}</span>
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