"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "./api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        // Skip authentication check entirely in development
        // IMPORTANT: REMOVE THIS IN PRODUCTION
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Always ensure there's a token, but don't redirect
        if (typeof window !== "undefined" && !localStorage.getItem("pana_access_token")) {
          localStorage.setItem("pana_access_token", "global_dev_token");
        }
        
        // Uncomment for production use
        /*
        // Only check auth on client side
        if (typeof window !== "undefined") {
          const isAuth = authAPI.checkAuth();
          setIsAuthenticated(isAuth);
          
          if (!isAuth) {
            router.push("/login");
          }
        }
        */
      } catch (error) {
        console.error("Auth check error:", error);
        // Don't redirect on errors, just set authenticated
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading };
}

export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
          <p className="ml-4 text-gray-500">Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Router will redirect to login
    }

    return <Component {...props} />;
  };
}