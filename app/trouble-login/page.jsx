"use client";
import Link from "next/link";
import Image from "next/image";

export default function TroubleLoginPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      {/* Left Side - Blue Section */}
      <div className="bg-[#29AAE1] text-white w-full md:w-2/5 p-8 flex flex-col items-center justify-center relative">
        <div className="text-center mb-8 max-w-xs">
          <h1 className="text-2xl font-bold mb-2">
            Great care, any time, any where, when you need it
          </h1>
          <p className="text-sm opacity-80">
            We're here to help you get back into your account or create a new one.
          </p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-6 rounded-lg max-w-xs w-full">
           <Image src={"/curious.png"} alt="panacarelogo.png" width={300} height={300} className="mx-auto mb-4" />
          {/* <h3 className="text-white font-semibold mb-4">Account Help</h3> */}
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
              <span>Create a new admin account</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
              <span>Reset your password</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
              <span>Return to login</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Right Side - Options */}
      <div className="bg-white w-full md:w-3/5 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-8">
            <Image src="/logo.jpg" alt="panacarelogo.png" width={300} height={300} />
          </div>
          
          <h2 className="text-xl font-semibold mb-8 text-center text-grey-800">
            Trouble Logging In?
          </h2>
          
          <div className="space-y-4">
            <Link 
              href="/register" 
              className="block w-full text-center py-3 px-4 rounded-full bg-[#29AAE1] text-white font-semibold hover:bg-blue-600 transition duration-200"
            >
              Sign Up / Register
            </Link>
            
            <Link 
              href="/reset-password" 
              className="block w-full text-center py-3 px-4 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-300 hover:bg-blue-200 transition duration-200"
            >
              Reset Your Password
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-500 text-sm hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
