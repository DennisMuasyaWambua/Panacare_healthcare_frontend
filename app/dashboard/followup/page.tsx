"use client";
import React, { useEffect } from 'react'
import Allappointments from '../../ui/apointments/appointments';
import Teleconsulatationtag from  '../../ui/teleconsulatation/teleconsulatation'
import FollowupPage from "../../ui/Followupcomponent/followup"

const Followup = () => {
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_page', 'appointments');
      localStorage.setItem('appointments_page_loaded', 'true');
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        console.log('appointments page unmounted');
      }
    };
  }, []);
  
  return (
    <FollowupPage />
  )
}

export default Followup