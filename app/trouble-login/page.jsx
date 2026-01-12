"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function TroubleLoginPage() {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side - Blue Section */}
      <div className="hidden md:flex w-[40%] lg:w-1/2 bg-[#29AAE1] flex-col items-center justify-center p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="max-w-md text-center mb-8 lg:mb-12 z-10">
          <h1 className="text-2xl lg:text-4xl font-bold leading-tight">
            Great care, any time, any where, when you need it
          </h1>
        </div>

        {/* Mobile Mockup Holder */}
        <div className="relative w-56 lg:w-64 h-[400px] lg:h-[500px] z-10 transition-all duration-300">
          <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] lg:rounded-[3rem] backdrop-blur-sm border-4 border-white/20 shadow-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-[#E6F6FD]">
              <Image
                src="/curious.png"
                alt="App Mockup"
                width={256}
                height={512}
                className="object-cover w-full h-full p-2"
              />
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex gap-2 mt-6 lg:mt-8 z-10">
          <div className="w-8 h-1.5 bg-white rounded-full"></div>
          <div className="w-2 h-1.5 bg-white/40 rounded-full"></div>
          <div className="w-2 h-1.5 bg-white/40 rounded-full"></div>
        </div>
      </div>

      {/* Right Side - Options Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-16">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6 lg:mb-10">
            <div className="bg-[#29AAE1] text-white font-bold rounded-[8px] px-3 py-1.5 lg:px-4 lg:py-2 text-xl lg:text-2xl mr-1">
              Pana
            </div>
            <div className="text-[#7F375E] text-xl lg:text-2xl font-semibold">
              +Care
            </div>
          </div>

          <h2 className="text-xl lg:text-3xl font-bold mb-4 text-gray-900">
            Trouble logging in?
          </h2>
          <p className="text-gray-500 mb-6 lg:mb-8">
            Select an option below to get back to your account.
          </p>

          <div className="grid grid-cols-1 gap-4 w-full">
            <Link
              href="/reset-password"
              className="group flex flex-col-1 items-center justify-center gap-4 p-2 border-1 border-gray-100 rounded-2xl hover:border-[#29AAE1] hover:bg-[#E6F6FD] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-[#E6F6FD] group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-[#29AAE1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <span className="text-lg text-gray-900">Reset Password</span>
              {/* <p className="text-sm text-gray-500 mt-1">Found my password or need to reset it</p> */}
            </Link>

            <Link
              href="/register"
              className="group flex flex-col-1 items-center justify-center gap-4 bg-[#29AAE1] p-2 border-1 border-gray-100 rounded-2xl hover:border-[#29AAE1] hover:bg-[#E6F6FD] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-[#E6F6FD] group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-[#29AAE1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="text-lg text-gray-900">Register / Sign up</span>
              {/* <p className="text-sm text-gray-500 mt-1">Create a new account</p> */}
            </Link>
          </div>

          <div className="mt-10 lg:mt-12">
            <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-[#29AAE1] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
