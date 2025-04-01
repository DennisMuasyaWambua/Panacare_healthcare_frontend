"use client";
import React, { useState } from "react";
import { Menu, X, Search, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  console.log(pathname);
  const isActive = (path) => pathname === path;
  const isActiveSub = (path) => pathname.startsWith(path);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          fixed md:static w-64 h-full bg-white shadow-md z-10 transition-transform
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="px-4 py-3 border-b border-gray-700 w-3/4 mx-auto">
          <div className="flex items-center justify-center">
            <div className="text-blue-500 font-bold text-lg image-container">
              {/* Pana<span className="text-red-500">Care</span> */}
              <Image src={"/logo.jpg"} width={154} height={35} alt="Panacare Logo"/>
            </div>
            {/* <span className="ml-3 text-gray-500 text-sm">Dashboard</span> */}
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="pt-4">
          <div className="px-4 mb-2">
            <div className="flex items-center bg-gray-100 p-2 rounded-md">
              <Search size={18} className="text-gray-400" />
              <span className="text-gray-400 ml-2 text-sm">Search menu</span>
            </div>
          </div>

          <ul className="mt-2">
            <li className="px-4 py-2 flex items-center  text-gray-600">
              <LayoutDashboard/>
              <Link href={"/dashboard"} className="text-sm font-medium">Dashboard</Link>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg
                className="w-5 h-5 mr-3 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8H4z" />
              </svg>
              <Link href={"/dashboard/patients"} className="text-sm">View patients</Link>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg
                className="w-5 h-5 mr-3 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 14V8H4v6h8l4 4v-4h4z" />
              </svg>
              <span className="text-sm">App Content</span>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg
                className="w-5 h-5 mr-3 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12l-8 4V6l8-4 8 4v10l-8 4z" />
              </svg>
              <span className="text-sm">Manage Units</span>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg
                className="w-5 h-5 mr-3 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 4h16v6H4V4zm0 10h16v6H4v-6z" />
              </svg>
              <span className="text-sm">System Vitals</span>
              <ChevronDown size={16} className="ml-auto" />
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg
                className="w-5 h-5 mr-3 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
              </svg>
              <span className="text-sm">Manage Users</span>
              <ChevronDown size={16} className="ml-auto" />
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
