"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  LayoutDashboard,
  User2Icon,
} from "lucide-react";
import { FaClinicMedical, FaDiagnoses, FaUserNurse } from "react-icons/fa";
import { MdWifiProtectedSetup } from "react-icons/md";
import { VscOrganization } from "react-icons/vsc";
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
              <Image
                src={"/logo.jpg"}
                width={154}
                height={35}
                alt="Panacare Logo"
              />
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
            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                isActive("/dashboard") ? "text-[#29AAE1]" : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <LayoutDashboard
                className={`${
                  isActive("/dashboard") ? "text-[#29AAE1]" : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <Link href={"/dashboard"} className="text-sm font-medium">
                Dashboard
              </Link>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                isActive("/dashboard/patients")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <User2Icon
                className={`${
                  isActive("/dashboard/patients")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <Link
                href={"/dashboard/patients"}
                className="text-base font-medium"
              >
                View Patients
              </Link>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                isActive("/dashboard/doctors")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <FaUserNurse
                className={`${
                  isActive("/dashboard/doctors")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <Link
                href={"/dashboard/doctors"}
                className="text-base font-medium"
              >
                View Doctors
              </Link>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                isActive("/dashboard/clinics")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <FaClinicMedical
                className={`${
                  isActive("/dashboard/clinics")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <span className="text-base font-medium">Manage Clinics</span>
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                isActive("/dashboard/system-setup")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <MdWifiProtectedSetup
                className={`${
                  isActive("/dashboard/system-setup")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <span className="text-base font-medium">System Setup</span>
              <ChevronDown
                className={`${
                  isActive("/dashboard/system-setup")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
            </li>

            <li
              className={`px-4 py-2 flex items-center gap-4 font-semibold ${
                isActive("/dashboard/manage-users")
                  ? "text-[#29AAE1]"
                  : "text-gray-600"
              } hover:text-[#29AAE1]`}
            >
              <VscOrganization
                className={`${
                  isActive("/dashboard/manage-users")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
              <span className="text-base font-medium">Manage Users</span>
              <ChevronDown
                className={`${
                  isActive("/dashboard/manage-users")
                    ? "text-[#29AAE1]"
                    : "text-gray-600"
                } hover:text-[#29AAE1]`}
              />
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
