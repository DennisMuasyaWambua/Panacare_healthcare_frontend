"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "../ui/login/Login";

const LoginPageScreen = () => {
  const router = useRouter();
  
  // If user already has a token, redirect to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasToken = localStorage.getItem('access_token');
      
      // Check if we're coming from dashboard to login
      const fromDashboard = sessionStorage.getItem('from_dashboard');
      
      if (hasToken && !fromDashboard) {
        // User already logged in, redirect to dashboard
        router.push('/dashboard');
      }
      
      // Set a permanent access token
      localStorage.setItem('access_token', 'login_page_token');
    }
  }, [router]);
  
  return <Login />;
};

export default LoginPageScreen;
