"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First, clean up any existing tokens to ensure a fresh login
      const authUtils = await import('../../utils/authUtils').then(module => module.default);
      authUtils.cleanupConflictingTokens();
      
      const response = await fetch("https://panacaredjangobackend-production.up.railway.app/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log("API login response:", data);
      
      if (response.ok && data.access) {
        // Process login through AuthContext
        const loginSuccess = login(data);
        
        if (loginSuccess) {
          toast.success("Login successful!");
          
          // Use direct window location for a clean navigation without history
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        } else {
          toast.error("Failed to process login data");
        }
      } else {
        toast.error(data.message || data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
          <Image 
            src="/frame.png" 
            alt="Phone Image" 
            layout="fill" 
            objectFit="contain" 
            className="absolute bottom-0 left-0 right-0 top-0"
          />
        </div>
        
       
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-white w-full md:w-3/5 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-8">
            <Image src="/logo.jpg" alt="panacarelogo.png" width={300} height={300}/>
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
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
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
              disabled={isLoading}
              className="w-full bg-[#29AAE1] text-white py-3 rounded-full hover:bg-blue-600 transition duration-200 disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <a href="/trouble-login" className="text-blue-500 text-sm hover:underline">
              Trouble logging in?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login