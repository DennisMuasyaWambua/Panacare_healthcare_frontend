"use client";
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import authUtils from '../utils/authUtils';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isInitialized, hasRole } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only check after initialization is complete and not already redirecting
    if (isInitialized && !loading && !isRedirecting) {
      if (!user || !authUtils.isAuthenticated()) {
        // Prevent multiple redirects
        setIsRedirecting(true);
        console.log('Not authenticated, redirecting to login...');
        
        // Use window.location for a clean redirect without keeping history
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
  }, [user, loading, isInitialized, isRedirecting]);

  // Show loading state while authentication is being checked
  if (loading || !isInitialized || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  // If not authenticated (this should not happen due to redirect above)
  if (!user || !authUtils.isAuthenticated()) {
    return null;
  }

  // Check for required role
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role, render children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
};

export default ProtectedRoute;
