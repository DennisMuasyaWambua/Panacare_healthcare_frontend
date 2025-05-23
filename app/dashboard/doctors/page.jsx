"use client";
import React, { useEffect } from 'react';
import ListofDoctors from '../../ui/Doctors/listOfDoctors/ListOfDoctors';
import { useAuth } from '../../context/AuthContext';

const ListofDoctorsScreen = () => {
  const { isAuthenticated } = useAuth();
  
  // Set authentication token for this page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Global token for all pages
      localStorage.setItem('pana_access_token', 'doctor_list_permanent_token');
      // Mark current page
      sessionStorage.setItem('current_page', 'doctors');
      // Set a specific flag for debugging
      localStorage.setItem('doctors_page_loaded', 'true');
      // Console log to verify execution
      console.log('Doctors page mounted, auth token set');
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        console.log('Doctors page unmounted');
      }
    };
  }, []);

  return (
    <ListofDoctors />
  );
};

export default ListofDoctorsScreen;