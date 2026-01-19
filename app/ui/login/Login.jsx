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
      // store token on authetication
      authUtils.storeAuthData(data);
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
    <div className="h-screen w-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side - Blue Section */}
      <div className="hidden md:flex w-[30%] lg:w-1/2 bg-[#29AAE1] flex-col items-center justify-center p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="max-w-md text-center mb-8 lg:mb-12 z-10">
          <h1 className="text-2xl lg:text-4xl font-bold leading-tight">
            Great care, any time, any where, when you need it
          </h1>
        </div>

        {/* Mobile Mockup Holder */}
        <div className="relative w-56 lg:w-64 h-[400px] lg:h-[500px] z-10 transition-all duration-300">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/frame.png"
              alt="App Mockup"
              width={256}
              height={512}
              className="object-contain w-full h-full p-2"
            />
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex gap-2 mt-6 lg:mt-8 z-10">
          <div className="w-8 h-1.5 bg-white rounded-full"></div>
          <div className="w-2 h-1.5 bg-white/40 rounded-full"></div>
          <div className="w-2 h-1.5 bg-white/40 rounded-full"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6 lg:mb-10">
            <Image
              src="/logo.png"
              alt="PanaCare Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </div>

          <h2 className="text-lg lg:text-xl font-medium mb-6 lg:mb-8 text-center text-gray-800">
            Welcome, Please sign in to begin your task.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 text-gray-900 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#29AAE1] text-white py-3.5 rounded-lg hover:bg-[#2398ca] transition duration-200 disabled:opacity-70 font-semibold shadow-md mt-4"
            >
              {isLoading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200"></div>
              <span className="relative bg-white px-4 text-sm text-gray-600">
                <a href="/trouble-login" title="Trouble logging in?" className="hover:text-[#29AAE1]">
                  Trouble logging in?
                </a>
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-[#29AAE1] font-semibold hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login