import { LayoutDashboard, User2Icon } from "lucide-react";
import { FaClinicMedical, FaUserNurse } from "react-icons/fa";
import { MdWifiProtectedSetup } from "react-icons/md";
import { VscOrganization } from "react-icons/vsc";
import React from "react";

export const sidebarMenuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    renderIcon: (isActive) => (
      <LayoutDashboard
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/patients",
    label: "View Patients",
    renderIcon: (isActive) => (
      <User2Icon
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/doctors",
    label: "View Doctors",
    renderIcon: (isActive) => (
      <FaUserNurse
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/facilities",
    label: "Manage Clinics",
    renderIcon: (isActive) => (
      <FaClinicMedical
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/system-setup",
    label: "System Setup",
    renderIcon: (isActive) => (
      <MdWifiProtectedSetup
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
    hasDropdown: true,
  },
  {
    path: "/dashboard/manage-users",
    label: "Manage Users",
    renderIcon: (isActive) => (
      <VscOrganization
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
    hasDropdown: true,
  },
  {
    path: "/dashboard/subscriptions",
    label: "Subscriptions",
    renderIcon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${
          isActive ? "text-[#29AAE1]" : "text-gray-600"
        } hover:text-[#29AAE1]`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    ),
  },
  {
    path: "/dashboard/blog-management",
    label: "Blog Management",
    renderIcon: (isActive) => (
      <VscOrganization
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
    // hasDropdown: true,
  },
];
