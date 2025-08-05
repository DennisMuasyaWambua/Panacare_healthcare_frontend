"use client";
import React, { useState } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";
import { doctorsAPI } from "../../../utils/api";
import { toast } from "react-toastify";

export const DoctorDetailsPopup = ({ doctor, onClose, onVerify }) => {
  // Safety check for doctor object
  const safeDoctor = doctor || {};
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(safeDoctor.is_verified || false);
  
  // Handle verification
  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      
      if (!safeDoctor.id) {
        toast.error("Doctor ID not found. Cannot verify.");
        return;
      }
      
      // Call API to verify doctor
      await doctorsAPI.verifyDoctor(safeDoctor.id);
      
      setIsVerified(true);
      toast.success("Doctor verification successful!");
      
      // Call parent component's onVerify if provided
      if (onVerify) {
        onVerify(safeDoctor.id);
      }
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error("Failed to verify doctor. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#7F375E]">Doctor Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Doctor Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-semibold">
              {safeDoctor.user ? `${safeDoctor.user.first_name} ${safeDoctor.user.last_name}` : 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{safeDoctor.user ? safeDoctor.user.email : 'No email'}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-semibold">{safeDoctor.user ? safeDoctor.user.phone_number : 'No phone'}</p>
          </div>
          <div>
            <p className="text-gray-500">Specialty</p>
            <p className="font-semibold">{safeDoctor.specialty || "Not specified"}</p>
          </div>
          <div>
            <p className="text-gray-500">License Number</p>
            <p className="font-semibold">{safeDoctor.license_number || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-500">Years of Experience</p>
            <p className="font-semibold">{safeDoctor.years_of_experience || "Not specified"}</p>
          </div>
          <div>
            <p className="text-gray-500">Verification Status</p>
            <p className="font-semibold flex items-center">
              {isVerified || safeDoctor.is_verified ? (
                <>
                  <CheckCircle className="mr-2 text-green-500" size={16} />
                  Verified
                </>
              ) : (
                <>
                  <XCircle className="mr-2 text-yellow-500" size={16} />
                  Not Verified
                </>
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-semibold">{safeDoctor.address || "Not specified"}</p>
          </div>
          {safeDoctor.qualifications && (
            <div className="col-span-2">
              <p className="text-gray-500">Qualifications</p>
              <p className="font-semibold">{safeDoctor.qualifications}</p>
            </div>
          )}
          {safeDoctor.bio && (
            <div className="col-span-2">
              <p className="text-gray-500">Bio</p>
              <p className="font-semibold">{safeDoctor.bio}</p>
            </div>
          )}
          {safeDoctor.available_days && (
            <div className="col-span-2">
              <p className="text-gray-500">Available Days</p>
              <p className="font-semibold">{safeDoctor.available_days.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          {!isVerified && !safeDoctor.is_verified && (
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-4 py-2 bg-green-500 text-white rounded mr-2 disabled:bg-green-300"
            >
              {isVerifying ? "Verifying..." : "Verify Doctor"}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2"
          >
            Close
          </button>
          <button
            onClick={() => window.location.href = `/dashboard/doctors/view/${safeDoctor.id}`}
            className="px-4 py-2 bg-[#29AAE1] text-white rounded"
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};
