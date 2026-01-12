"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://panacaredjangobackend-production.up.railway.app/api/users/register-admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_token: "panacare_secure_admin_token_2025",
          ...form
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Registration successful! Please login.");
        setTimeout(() => {
          router.replace("/login");
        }, 10);
      } else {
        toast.error(data.detail || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Right Side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-12 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md">
          {/* Logo and Back to Login - Flexed in same row */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-[#29AAE1] text-white font-bold rounded-[8px] px-3 py-1.5 lg:px-4 lg:py-2 text-xl lg:text-2xl mr-1">
                Pana
              </div>
              <div className="text-[#7F375E] text-xl lg:text-2xl font-semibold">
                +Care
              </div>
            </div>

            {/* Back to Login Link */}
            <Link
              href="/login"
              className="text-[#29AAE1] font-semibold hover:underline text-sm whitespace-nowrap"
            >
              Back to Login
            </Link>
          </div>

          <h2 className="text-xl lg:text-3xl font-bold mb-4 text-center text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-500 mb-6 lg:mb-8 text-center">
            Register for a new admin account to get started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] outline-none"
                placeholder="+254..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29AAE1] outline-none"
                placeholder="Nairobi, Kenya"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#29AAE1] text-white py-3.5 rounded-lg hover:bg-[#2398ca] transition duration-200 disabled:opacity-70 font-semibold shadow-md mt-4"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
