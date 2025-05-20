"use client";
import { useEffect } from "react";
import Sidebar from "../ui/sidebar/Sidebar";
import styles from "./layout.module.css";
import Navbar from "../ui/navbar/Navbar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { isAuthenticated, isReady } = useAuth();
  
  // Set token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pana_access_token', 'dashboard_permanent_token');
    }
  }, []);
  
  // Show loading state or content
  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Navbar />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
