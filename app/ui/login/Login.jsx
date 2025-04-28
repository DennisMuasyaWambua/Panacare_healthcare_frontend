"use client"
import React from 'react'
import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = { email, password };
  
    try {
      const response = await fetch("http://panacaredjangobackend-production.up.railway.app/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

        console.log(data)
  
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }
  
      const result = await response.json();
  
      // Store the access token in local storage
      localStorage.setItem("access_token", result.access_token);
      toast.success("Login successful!");

      setTimeout(() => {
        // Redirect to the dashboard
      window.location.href = "/dashboard";
      }, 2000);

      
    } catch (error) {
      console.error("Error during login:", error.message);
      toast.error("Login failed. Please try again.");
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
    {/* Left Side - Blue Section with Phone Image */}
    <div className="bg-[#29AAE1] text-white w-full md:w-2/5 p-8 flex flex-col items-center justify-center relative">
      <div className="text-center mb-8 max-w-xs">
        <h1 className="text-2xl font-bold mb-2">
          Great care, any time, any where, when you need it
        </h1>
      </div>
      
      <div className="relative w-64 h-96 mx-auto">
        <div className="border-8 border-black rounded-3xl overflow-hidden h-full w-full relative">
          {/* Phone Screen Content */}
          <div className="bg-white h-full w-full p-2">
            {/* App Header */}
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <span className="ml-2 text-black text-xs">Email</span>
              </div>
              <Image src="/logo.jpg" alt="panacarelogo.png" width={100} height={100}/>
              <div className="w-4 h-4"></div>
            </div>
            
            {/* Content Area */}
            <div className="mt-4 p-2">
              <p className="text-black text-xs mb-2">Welcome to</p>
              
              {/* Banner Image */}
              <div className="rounded-lg mb-4 w-full h-16 relative">
                <div className="bg-gray-200 rounded-lg w-full h-full flex items-center justify-center">
                  <p className="text-black text-xs">Exceptional care for you and your family</p>
                </div>
              </div>
              
              {/* Menu Tiles */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-500 rounded-lg p-2 text-white text-xs h-16 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 mb-1 bg-white rounded-full"></div>
                  <span>Telehealth</span>
                </div>  
                <div className="bg-blue-500 rounded-lg p-2 text-white text-xs h-16 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 mb-1 bg-white rounded-full"></div>
                  <span>Resources</span>
                </div>
                <div className="bg-blue-500 rounded-lg p-2 text-white text-xs h-16 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 mb-1 bg-white rounded-full"></div>
                  <span>Find a Doctor</span>
                </div>
                <div className="bg-blue-500 rounded-lg p-2 text-white text-xs h-16 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 mb-1 bg-white rounded-full"></div>
                  <span>Schedule Visit</span>
                </div>
              </div>
              
              {/* Bottom Button */}
              <div className="mt-4 bg-blue-500 rounded-lg p-2 text-white text-center">
                <span className="text-xs">Let's talk</span>
              </div>
            </div>
            
            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center bg-white p-2 border-t border-gray-200">
              <div className="w-6 h-6"></div>
              <div className="w-6 h-6"></div>
              <div className="w-6 h-6"></div>
              <div className="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex mt-6 space-x-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-white opacity-50 rounded-full"></div>
        <div className="w-2 h-2 bg-white opacity-50 rounded-full"></div>
      </div>
    </div>

    {/* Right Side - Login Form */}
    <div className="bg-white w-full md:w-3/5 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <Image src="/logo.jpg" alt="panacarelogo.png"width={300} height={300}/>
        </div>
        
        <h2 className="text-xl font-semibold mb-8 text-center text-grey-800">
          Welcome, Please sign in to begin your task.
        </h2>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-balck mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#29AAE1] text-white py-3 rounded-full hover:bg-blue-600 transition duration-200"
          >
            <Link href="/dashboard">
            Log In
            </Link>
          </button>
        </form>
        
        <div className="text-center mt-6">
          <a href="#" className="text-blue-500 text-sm hover:underline">
            Trouble logging in?
          </a>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Login