"use client";
import React, { useEffect } from 'react';
import ProvidersPerformance from '../../ui/ProvidersPerformance/ProvidersPerformance';
import { useAuth } from '../../context/AuthContext';

const ProvidersPerformancePage = () => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('current_page', 'providers-performance');
        }
    }, []);

    return (
        <ProvidersPerformance />
    );
};

export default ProvidersPerformancePage;
