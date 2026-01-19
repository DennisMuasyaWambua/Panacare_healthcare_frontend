"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [resetMethod, setResetMethod] = useState("number");
  const [contactInfo, setContactInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    otp: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!contactInfo) {
      toast.error(`Please enter your ${resetMethod === 'number' ? 'phone number' : 'email'}!`);
      return;
    }
    setLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success(`OTP sent to ${contactInfo}!`);
    }, 800);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Placeholder for actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Password changed successfully!");
      router.push("/login");
    } catch (err) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for password strength indicator
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length > 6) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    return strength;
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side - Illustration Section */}
      <div className="hidden md:flex w-[45%] bg-[#FFFFFF] flex-col items-center justify-center p-12 relative">
        <div className="relative w-full max-w-lg z-10">
          <Image
            src="/curious.png"
            alt="Forgot Password Illustration"
            width={600}
            height={600}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Right Side - Step Forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-[#29AAE1] text-white font-bold rounded-[8px] px-4 py-2 text-2xl mr-1">
              Pana
            </div>
            <div className="text-[#7F375E] text-2xl font-semibold">
              +Care
            </div>
          </div>

          {step === 1 ? (
            <div className="w-full">
              <h2 className="text-xl lg:text-xl font-bold mb-6 text-gray-900">
                Select An Option To Reset Your Password
              </h2>

              <form onSubmit={handleProceed} className="space-y-4">
                <div
                  onClick={() => {
                    setResetMethod("number");
                    setContactInfo("");
                  }}
                  className={`flex items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer shadow-sm transition-all duration-300 ${resetMethod === "number" ? "ring-2 ring-[#29AAE1]/20" : "opacity-80"
                    }`}
                >
                  <span className="text-gray-800 text-lg">Send OTP on number</span>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${resetMethod === "number" ? "border-black" : "border-gray-300"
                    }`}>
                    {resetMethod === "number" && <div className="w-6 h-6 bg-[#29AAE1] rounded-full border-2 border-white"></div>}
                  </div>
                </div>

                <div
                  onClick={() => {
                    setResetMethod("email");
                    setContactInfo("");
                  }}
                  className={`flex items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer shadow-sm transition-all duration-300 ${resetMethod === "email" ? "ring-2 ring-[#29AAE1]/20" : "opacity-80"
                    }`}
                >
                  <span className="text-gray-800 text-lg">Send OTP on email</span>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${resetMethod === "email" ? "border-black" : "border-gray-300"
                    }`}>
                    {resetMethod === "email" && <div className="w-6 h-6 bg-[#29AAE1] rounded-full border-2 border-white"></div>}
                  </div>
                </div>

                {/* Identifier Input Field */}
                <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {resetMethod === "number" ? "Enter Phone Number" : "Enter Email Address"}
                  </label>
                  <input
                    type={resetMethod === "number" ? "tel" : "email"}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full text-gray-900 px-5 py-3.5 border border-gray-400 rounded-full focus:ring-1 focus:ring-[#29AAE1] outline-none"
                    placeholder={resetMethod === "number" ? "Enter your phone number" : "Enter your email address"}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#29AAE1] text-white py-4 rounded-full hover:bg-[#2398ca] transition-all duration-300 disabled:opacity-70 font-bold text-lg mt-6 shadow-sm"
                >
                  {loading ? "Proceeding..." : "Proceed"}
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="text-xl lg:text-xl font-bold mb-6 text-gray-900">
                Welcome, Please reset your password
              </h2>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Enter OTP</label>
                  <div className="relative">
                    <input
                      type={showPasswords.otp ? "text" : "password"}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full text-gray-900 px-5 py-3.5 border border-gray-400 rounded-full focus:ring-1 focus:ring-[#29AAE1] outline-none pr-14"
                      placeholder="••••••••••••••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('otp')}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-800"
                    >
                      {showPasswords.otp ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">New Password:</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full text-gray-900 px-5 py-3.5 border border-gray-400 rounded-full focus:ring-1 focus:ring-[#29AAE1] outline-none pr-14"
                      placeholder="••••••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-800"
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {/* Password Strength Indicator - 3 sections like the image */}
                  <div className="flex gap-2 mt-3 px-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= (getPasswordStrength() >= 3 ? 3 : getPasswordStrength()) ? "bg-[#27E881]" : "bg-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Confirm Password:</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-gray-900 px-5 py-3.5 border border-gray-400 rounded-full focus:ring-1 focus:ring-[#29AAE1] outline-none pr-14"
                      placeholder="••••••••••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-800"
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#29AAE1] text-white py-4 rounded-full hover:bg-[#2398ca] transition-all duration-300 disabled:opacity-70 font-bold text-lg mt-8"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}

          <div className="mt-12 text-center text-sm font-medium text-gray-600">
            <Link href="/login" className="hover:text-[#29AAE1] transition-colors inline-flex items-center gap-2">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
