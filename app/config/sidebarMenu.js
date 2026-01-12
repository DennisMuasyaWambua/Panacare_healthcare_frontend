import React from "react";
import {
  Building,
  ChartNoAxesCombined,
  CalendarDays,
  FileText,
  Activity,
  CreditCard,
  BookOpen,
  FileCheck,
  Bell
} from "lucide-react";
import { FaUserDoctor, FaUserCheck } from "react-icons/fa6";
import { FaHome, FaUserCog, FaUserPlus, FaChartPie } from "react-icons/fa";
import { BiSolidPackage } from "react-icons/bi";
import { HiSpeakerphone } from "react-icons/hi";
import { RiHospitalFill } from "react-icons/ri";
import { MdWifiProtectedSetup } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";
import { TbPresentationAnalyticsFilled } from "react-icons/tb";

export const sidebarMenuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    allowedRoles: ["admin", "doctor", "patient"],
    renderIcon: (isActive) => (
      <FaHome
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/patients",
    label: "Patients",
    allowedRoles: ["admin", "doctor"],
    renderIcon: (isActive) => (
      <FaUserPlus
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/doctors",
    label: "Doctors",
    allowedRoles: ["admin", "patient", "doctor"],
    renderIcon: (isActive) => (
      <div className="relative">
        <FaUserDoctor
          size={20}
          className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
        />
        <div className={`absolute -top-1 -right-1 font-bold text-[10px] ${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}>+</div>
      </div>
    ),
  },
  {
    path: "/dashboard/facilities",
    label: "Hospital",
    allowedRoles: ["admin", "doctor"],
    renderIcon: (isActive) => (
      <div className="relative">
        <RiHospitalFill
          size={20}
          className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
        />
        <div className={`absolute -top-1 -right-1 font-bold text-[10px] ${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}>+</div>
      </div>
    ),
  },
  {
    path: "/dashboard/providers-performance",
    label: "Providers Performance",
    allowedRoles: ["admin", "doctor"],
    renderIcon: (isActive) => (
      <TbPresentationAnalyticsFilled
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/appointments",
    label: "Appointments",
    allowedRoles: ["admin", "doctor", "patient"],
    renderIcon: (isActive) => (
      <IoCalendarNumber
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/teleconsultation",
    label: "Teleconsultation Log",
    allowedRoles: ["admin", "doctor", "patient"],
    renderIcon: (isActive) => (
      <FileText
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/followup",
    label: "Follow-Up Compliance Monitor",
    allowedRoles: ["admin", "doctor"],
    renderIcon: (isActive) => (
      <ChartNoAxesCombined
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/subscriptions",
    label: "Subscriptions",
    allowedRoles: ["admin", "doctor"],
    renderIcon: (isActive) => (
      <div className="relative">
        <FaUserCheck
          size={20}
          className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
        />
        <div className={`absolute bottom-0 -right-1 font-bold text-[10px] ${isActive ? "text-white" : "text-[#7F375E]"}`}>+</div>
      </div>
    ),
  },
  {
    path: "/dashboard/package-payment-tracker",
    label: "Package Payment Tracker",
    allowedRoles: ["admin"],
    renderIcon: (isActive) => (
      <BiSolidPackage
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/risk-segmentation",
    label: "Risk Segmentation",
    allowedRoles: ["admin", "doctor"],
    renderIcon: (isActive) => (
      <FaChartPie
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  // {
  //   path: "/dashboard/compliance-monitor",
  //   label: "Compliance Monitor",
  //   allowedRoles: ["admin", "doctor"],
  //   renderIcon: (isActive) => (
  //     <FileCheck
  //       size={20}
  //       className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
  //     />
  //   ),
  // },
  {
    path: "/dashboard/blog-management",
    label: "Blog Management",
    allowedRoles: ["admin", "doctor"],
    renderIcon: (isActive) => (
      <HiSpeakerphone
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/manage-users",
    label: "Users",
    allowedRoles: ["admin"],
    renderIcon: (isActive) => (
      <FaUserCog
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  {
    path: "/dashboard/audit-logs",
    label: "Audit Logs",
    allowedRoles: ["admin"],
    renderIcon: (isActive) => (
      <FileCheck
        size={20}
        className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
      />
    ),
  },
  // {
  //   path: "/dashboard/system-setup",
  //   label: "System Setup",
  //   allowedRoles: ["admin"],
  //   renderIcon: (isActive) => (
  //     <MdWifiProtectedSetup
  //       size={20}
  //       className={`${isActive ? "text-[#7F375E]" : "text-[#7F375E]"}`}
  //     />
  //   ),
  // },
];
