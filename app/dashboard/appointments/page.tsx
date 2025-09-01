"use client";
import React, { useEffect } from 'react'
import Followupcomponent from  '../../ui/Followupcomponent/followup'
import AllAppointments from '../../ui/apointments/appointments'
const Appointments = () => {
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_page', 'followup');
      localStorage.setItem('followup_page_loaded', 'true');
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        console.log('followup page unmounted');
      }
    };
  }, []);
  
  return (
    <AllAppointments />
  )
}

export default Appointments