"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  LayoutDashboard,
  User2Icon,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { FaClinicMedical, FaDiagnoses, FaUserNurse } from "react-icons/fa";
import { MdWifiProtectedSetup } from "react-icons/md";
import { VscOrganization } from "react-icons/vsc";
import Image from "next/image";
import { directNavigate } from "../../utils/router";
import { useAuth } from "../../context/AuthContext";
import { sidebarMenu, sidebarMenuItems } from "../../config/sidebarMenu";

const Sidebar = () => {
  const { logout, hasRole, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
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
      <div className="md:hidden fixed top-4 left-4 z-[60]">
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
          fixed md:sticky top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo & Toggle */}
        <div className="border-b border-gray-200 w-full px-4 py-3 flex items-center justify-between h-14 relative flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center px-2">
              <Image
                src="/logo - 50.svg"
                alt="PanaCare Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className={`p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200 absolute ${collapsed ? "left-1/2 -translate-x-1/2" : "right-2"}`}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <ul className="mt-1 space-y-1">
            {sidebarMenuItems.map((item) => {
              // Check if user has permission to see this item
              const canView = item.allowedRoles.some(role => hasRole(role));

              if (!canView) return null;

              const isActive = checkActive(item.path);
              return (
                <li
                  key={item.path}
                  className={`relative px-3 py-2.5 mx-2 rounded-lg flex items-center cursor-pointer transition-colors
                    ${isActive
                      ? "bg-[#E6F6FD] border-l-4 border-[#29AAE1]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#29AAE1]"
                    }
                    ${collapsed ? "justify-center" : "gap-3"}
                   `}
                  onClick={() => directNavigate(item.path)}
                  title={collapsed ? item.label : ""}
                >
                  <div className="min-w-[18px] flex justify-center">
                    {item.renderIcon(isActive)}
                  </div>

                  {!collapsed && (
                    <>
                      <span className={`text-sm font-medium flex-1 ${isActive ? "text-[#29AAE1]" : ""}`}>
                        {item.label}
                      </span>
                      {item.hasDropdown && (
                        <ChevronDown
                          size={16}
                          className={`${isActive ? "text-[#29AAE1]" : "text-gray-400"}`}
                        />
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-2 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${collapsed ? "justify-center" : "gap-2"}`}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;