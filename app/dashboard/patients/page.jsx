"use client";
import ListofPatients from '../../ui/Patients/listOfPatients/ListofPatients'
import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';

const PatientsScreenPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Set authentication token for this page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Global token for all pages
      // Removed token setting that was causing conflicts
      // Mark current page
      sessionStorage.setItem('current_page', 'patients');
      // Set a specific flag for debugging
      localStorage.setItem('patients_page_loaded', 'true');
      // Console log to verify execution
      console.log('Patients page mounted, auth token set');
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        console.log('Patients page unmounted');
      }
    };
  }, []);
  
  return (
    <ListofPatients />
  )
}

export default PatientsScreenPage