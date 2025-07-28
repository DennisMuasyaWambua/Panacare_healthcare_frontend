"use client";
import { useState } from "react";
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
      const res = await fetch("/api/users/register-admin/", {
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
        router.push("/login");
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

      {/* Right Side - Register Form */}
      <div className="bg-white w-full md:w-3/5 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-8">
            <Image src="/logo.jpg" alt="panacarelogo.png" width={300} height={300}/>
          </div>
          
          <h2 className="text-xl font-semibold mb-8 text-center text-grey-800">
            Register for a new admin account
          </h2>
          
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Create a password"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-black mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="First name"
                />
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-black mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone_number" className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-black mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter address"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#29AAE1] text-white py-3 rounded-full hover:bg-blue-600 transition duration-200 disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link href="/login" className="text-blue-500 text-sm hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
