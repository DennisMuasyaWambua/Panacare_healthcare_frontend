"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  LayoutDashboard,
  User2Icon,
  LogOut
} from "lucide-react";
import { FaClinicMedical, FaDiagnoses, FaUserNurse } from "react-icons/fa";
import { MdWifiProtectedSetup } from "react-icons/md";
import { VscOrganization } from "react-icons/vsc";
import Image from "next/image";
import { directNavigate } from "../../utils/router";
import { useAuth } from "../../context/AuthContext";
import {sidebarMenu, sidebarMenuItems} from "../../config/sidebarMenu";

const Sidebar = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get current path for active state
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  };

  // Check if a path is active
  const checkActive = (path) => {
    return getCurrentPath() === path;
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static w-64 h-full bg-white border-r border-gray-200 z-10 transition-transform
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="border-b border-gray-200 w-full px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="text-blue-500 font-bold text-lg image-container">
              <Image
                src={"/panacarelogo.png"}
                width={120}
                height={35}
                alt="Panacare Logo"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="pt-4">
          <div className="px-4 mb-3">
            <div className="flex items-center bg-gray-100 p-2 rounded-md">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text"
                placeholder="Search an item" 
                className="bg-transparent border-none focus:outline-none text-gray-600 text-sm ml-2 w-full"
              />
            </div>
          </div>


          <ul className="mt-2">
            {sidebarMenuItems.map((item) => {
              const isActive = checkActive(item.path);
              return (
                <li
                  key={item.path}
                  className={`px-4 py-2 flex items-center gap-4 font-semibold ${isActive ? "text-[#29AAE1]" : "text-gray-600"
                    } hover:text-[#29AAE1]`}
                >
                  {item.renderIcon(isActive)}
                  <button
                    className="text-base font-medium text-left"
                    onClick={() => directNavigate(item.path)}
                  >
                    {item.label}
                  </button>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"
                        } hover:text-[#29AAE1]`}
                    />
                  )}
                </li>
              );
            })}


          </ul>
          
          {/* Logout button */}
          <div className="mt-auto px-4 py-4 absolute bottom-0 w-full">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 w-full px-2 py-2 hover:bg-red-50 rounded"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;