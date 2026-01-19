"use client";
import React, { useEffect } from 'react';
import ListOfUsers from '../../ui/users/ListOfUsers';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

const ManageUsersPage = () => {
    const { isAuthenticated } = useAuth();

    // Set authentication token for this page
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Mark current page
            sessionStorage.setItem('current_page', 'manage-users');
            // Set a specific flag for debugging
            localStorage.setItem('manage_users_page_loaded', 'true');
            // Console log to verify execution
            console.log('Manage Users page mounted, auth token set');
        }

        // Cleanup function
        return () => {
            if (typeof window !== 'undefined') {
                console.log('Manage Users page unmounted');
            }
        };
    }, []);

    return (
        <ProtectedRoute requiredRole="admin">
            <ListOfUsers />
        </ProtectedRoute>
    );
};

export default ManageUsersPage;