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
        size={20}
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/patients",
    label: "Patients",
    renderIcon: (isActive) => (
      <User2Icon
        size={20}
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/doctors",
    label: "Doctors",
    renderIcon: (isActive) => (
      <FaUserNurse
        size={20}
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/facilities",
    label: "Hospital",
    renderIcon: (isActive) => (
      <FaClinicMedical
        size={20}
        className={`${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
      />
    ),
  },
  {
    path: "/dashboard/appointments",
    label: "Appointments",
    renderIcon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4"></path>
        <path d="M16 2v4"></path>
        <path d="M3 10h18"></path>
        <rect width="18" height="14" x="3" y="6" rx="2"></rect>
      </svg>
    ),
  },
  {
    path: "/dashboard/teleconsulatation",
    label: "Teleconsultation tag",
    renderIcon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 10v5"></path>
        <path d="M9 10v5"></path>
        <path d="M12 10v5"></path>
        <circle cx="12" cy="4" r="2"></circle>
        <path d="M10 2h4"></path>
        <path d="M5 18c-.333 1.167-1 2.5-2 3"></path>
        <path d="M19 18c.333 1.167 1 2.5 2 3"></path>
        <path d="M12 18a4 4 0 0 0 4-4v-3a6 6 0 0 0-3-5.2"></path>
        <path d="M12 18a4 4 0 0 1-4-4v-3a6 6 0 0 1 3-5.2"></path>
      </svg>
    ),
  },
  {
    path: "/dashboard/followup",
    label: "Follow-Up Compliance Monitor",
    renderIcon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"></path>
        <polyline points="13 3 13 9 19 9"></polyline>
      </svg>
    ),
  },
  {
    path: "/dashboard/subscriptions",
    label: "Subscriptions",
    renderIcon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 22H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"></path>
        <path d="M18 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
        <circle cx="8" cy="10" r="1"></circle>
        <circle cx="16" cy="10" r="1"></circle>
        <circle cx="8" cy="14" r="1"></circle>
        <circle cx="16" cy="14" r="1"></circle>
      </svg>
    ),
  },
  {
    path: "/dashboard/package",
    label: "Package Payment Tracker",
    renderIcon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${isActive ? "text-[#29AAE1]" : "text-gray-600"} hover:text-[#29AAE1]`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
        <line x1="2" x2="22" y1="10" y2="10"></line>
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
  },
];
