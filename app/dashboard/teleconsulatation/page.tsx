"use client";
import React, { useEffect } from 'react'
import Allappointments from '../../ui/apointments/appointments';
import Teleconsulatationtag from  '../../ui/teleconsulatation/teleconsulatation'

const Teleconsulatationlogs = () => {
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_page', 'teleconsulatation');
      localStorage.setItem('teleconsulatation_page_loaded', 'true');
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        console.log('teleconsulatation page unmounted');
      }
    };
  }, []);
  
  return (
    <Teleconsulatationtag />
  )
}

export default Teleconsulatationlogs