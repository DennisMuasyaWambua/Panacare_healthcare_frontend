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
              <Image
                src={"/logo.jpg"}
                width={154}
                height={35}
                alt="Panacare Logo"
              />
            </div>
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
            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                checkActive("/dashboard") ? "text-[#29AAE1]" : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <LayoutDashboard
                className={`${
                  checkActive("/dashboard") ? "text-[#29AAE1]" : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-sm font-medium text-left"
                onClick={() => directNavigate('/dashboard')}
              >
                Dashboard
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                checkActive("/dashboard/patients")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <User2Icon
                className={`${
                  checkActive("/dashboard/patients")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-base font-medium text-left"
                onClick={() => {
                  console.log('Navigating to patients page');
                  // Set extra tokens for good measure
                  // Removed token setting that was causing conflicts
                  directNavigate('/dashboard/patients');
                }}
              >
                View Patients
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                checkActive("/dashboard/doctors")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <FaUserNurse
                className={`${
                  checkActive("/dashboard/doctors")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-base font-medium text-left"
                onClick={() => {
                  console.log('Navigating to doctors page');
                  // Set extra tokens for good measure
                  // Removed token setting that was causing conflicts
                  directNavigate('/dashboard/doctors');
                }}
              >
                View Doctors
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                checkActive("/dashboard/facilities")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <FaClinicMedical
                className={`${
                  checkActive("/dashboard/facilities")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-base font-medium text-left"
                onClick={() => {
                  console.log('Navigating to facilities page');
                  directNavigate('/dashboard/facilities');
                }}
              >
                Manage Clinics
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                checkActive("/dashboard/system-setup")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <MdWifiProtectedSetup
                className={`${
                  checkActive("/dashboard/system-setup")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-base font-medium text-left"
                onClick={() => {
                  console.log('Navigating to system setup page');
                  directNavigate('/dashboard/system-setup');
                }}
              >
                System Setup
              </button>
              <ChevronDown
                className={`${
                  checkActive("/dashboard/system-setup")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                checkActive("/dashboard/manage-users")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <VscOrganization
                className={`${
                  checkActive("/dashboard/manage-users")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-base font-medium text-left"
                onClick={() => {
                  console.log('Navigating to manage users page');
                  directNavigate('/dashboard/manage-users');
                }}
              >
                Manage Users
              </button>
              <ChevronDown
                className={`${
                  checkActive("/dashboard/manage-users")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
            </li>
            
            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                checkActive("/dashboard/subscriptions")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${
                  checkActive("/dashboard/subscriptions")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 22H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"></path>
                <path d="M18 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                <path d="M10 2v3"></path>
                <path d="M14 2v3"></path>
                <circle cx="8" cy="10" r="1"></circle>
                <circle cx="16" cy="10" r="1"></circle>
                <circle cx="8" cy="14" r="1"></circle>
                <circle cx="16" cy="14" r="1"></circle>
                <path d="m6 18 12 .01"></path>
              </svg>
              <button 
                className="text-base font-medium text-left"
                onClick={() => {
                  console.log('Navigating to subscriptions page');
                  directNavigate('/dashboard/subscriptions');
                }}
              >
                Subscriptions
              </button>
            </li>
          </ul>
          
          {/* Logout button */}
          <div className="mt-auto px-4 py-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 w-full px-2 py-2 hover:bg-red-50 rounded"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;