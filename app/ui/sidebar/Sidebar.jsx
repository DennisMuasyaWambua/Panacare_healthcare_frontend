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

          <ul className="mt-3">
            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard") ? "text-[#29AAE1]" : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <LayoutDashboard size={20}
                className={`${
                  checkActive("/dashboard") ? "text-[#29AAE1]" : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-sm text-left"
                onClick={() => directNavigate('/dashboard')}
              >
                Dashboard
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/patients")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <User2Icon size={20}
                className={`${
                  checkActive("/dashboard/patients")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to patients page');
                  directNavigate('/dashboard/patients');
                }}
              >
                Patients
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/doctors")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <FaUserNurse size={20}
                className={`${
                  checkActive("/dashboard/doctors")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to doctors page');
                  directNavigate('/dashboard/doctors');
                }}
              >
                Doctors
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/facilities")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <FaClinicMedical size={20}
                className={`${
                  checkActive("/dashboard/facilities")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to facilities page');
                  directNavigate('/dashboard/facilities');
                }}
              >
                Hospital
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/appointments")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${
                  checkActive("/dashboard/appointments")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4"></path><path d="M16 2v4"></path><path d="M3 10h18"></path><rect width="18" height="14" x="3" y="6" rx="2"></rect>
              </svg>
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to appointments page');
                  directNavigate('/dashboard/appointments');
                }}
              >
                Appointments
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/teleconsulatation")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${
                  checkActive("/dashboard/teleconsulatation")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 10v5"></path><path d="M9 10v5"></path><path d="M12 10v5"></path>
                <circle cx="12" cy="4" r="2"></circle><path d="M10 2h4"></path>
                <path d="M5 18c-.333 1.167-1 2.5-2 3"></path><path d="M19 18c.333 1.167 1 2.5 2 3"></path>
                <path d="M12 18a4 4 0 0 0 4-4v-3a6 6 0 0 0-3-5.2"></path>
                <path d="M12 18a4 4 0 0 1-4-4v-3a6 6 0 0 1 3-5.2"></path>
              </svg>
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to teleconsultation page');
                  directNavigate('/dashboard/teleconsulatation');
                }}
              >
                Teleconsultation tag
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/followup")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${
                  checkActive("/dashboard/followup")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"></path>
                <polyline points="13 3 13 9 19 9"></polyline>
              </svg>
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to follow-up page');
                  directNavigate('/dashboard/followup');
                }}
              >
                Follow-Up Compliance Monitor
              </button>
            </li>
            
            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/subscriptions")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${
                  checkActive("/dashboard/subscriptions")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 22H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"></path>
                <path d="M18 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                <circle cx="8" cy="10" r="1"></circle>
                <circle cx="16" cy="10" r="1"></circle>
                <circle cx="8" cy="14" r="1"></circle>
                <circle cx="16" cy="14" r="1"></circle>
              </svg>
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to subscriptions page');
                  directNavigate('/dashboard/subscriptions');
                }}
              >
                Subscriptions
              </button>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-3 ${
                checkActive("/dashboard/package")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1] hover:bg-gray-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${
                  checkActive("/dashboard/package")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
              <button 
                className="text-sm text-left"
                onClick={() => {
                  console.log('Navigating to package payment tracker page');
                  directNavigate('/dashboard/package');
                }}
              >
                Package Payment Tracker
              </button>
            </li>
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