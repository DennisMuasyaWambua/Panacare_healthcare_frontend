"use client";
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isInitialized, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if the authentication state is fully initialized and not loading
    if (isInitialized && !loading && !user) {
      // This timeout prevents the racing condition between dashboard render and login redirect
      const redirectTimeout = setTimeout(() => {
        router.replace('/login');
      }, 0);
      
      // Cleanup timeout if component unmounts
      return () => clearTimeout(redirectTimeout);
    }
  }, [user, loading, isInitialized, router]);

  // Only check for required roles if we have a user
  useEffect(() => {
    if (isInitialized && !loading && user && requiredRole && !hasRole(requiredRole)) {
      console.warn(`Access denied. Required role: ${requiredRole}`);
      // Don't redirect for role issues, just show access denied
    }
  }, [user, loading, isInitialized, requiredRole, hasRole]);

  // Show loading state while authentication is being checked
  if (loading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  // If not authenticated, render nothing (redirect happens in useEffect)
  if (!user) {
    return null;
  }

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

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
};

export default ProtectedRoute;
