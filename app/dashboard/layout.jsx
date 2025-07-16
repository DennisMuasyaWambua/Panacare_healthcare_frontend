"use client";
import { useEffect } from "react";
import Sidebar from "../ui/sidebar/Sidebar";
import styles from "./layout.module.css";
import Navbar from "../ui/navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

const Layout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
