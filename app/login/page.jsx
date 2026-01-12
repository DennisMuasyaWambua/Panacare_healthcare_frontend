"use client";
import React, { useEffect, useState } from "react";
import Login from "../ui/login/Login";
import authUtils from "../utils/authUtils";

const LoginPageScreen = () => {
  const [redirected, setRedirected] = useState(false);
  
  // If user already authenticated, redirect to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined' && !redirected) {
      // Always clean up any conflicting tokens
      authUtils.cleanupConflictingTokens();
      
      // Check if authenticated using our utility
      const isAuthenticated = authUtils.isAuthenticated();
      
      if (isAuthenticated) {
        // User already logged in, redirect to dashboard
        setRedirected(true);
        window.location.href = '/dashboard';
      }
    }
  }, [redirected]);
  
  return <Login />;
};

export default LoginPageScreen;
