import React from "react";
import { User } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md">
      {/* Left Section */}
      <div className="text-lg font-semibold text-[#800000]">Dashboard</div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-black" />
        <span className="text-blue-500 font-medium">Jamie Harlow</span>
      </div>
    </div>
  );
};

export default Navbar;