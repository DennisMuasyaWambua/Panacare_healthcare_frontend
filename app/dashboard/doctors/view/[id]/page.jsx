"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { doctorsAPI } from "../../../../utils/api";
import { directNavigate } from "../../../../utils/router";
import { toast } from "react-toastify";

const DoctorViewPage = ({ params }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        // The [id] from the dynamic route segment
        const doctorId = params.id;
        
        // In a real implementation, this would call an API
        const data = await doctorsAPI.getDoctorById(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
        setError("Failed to load doctor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [params.id]);

  const handleBack = () => {
    directNavigate("/dashboard/doctors");
  };

  const handleVerifyDoctor = async () => {
    try {
      if (!doctor || !doctor.id) return;
      
      await doctorsAPI.verifyDoctor(doctor.id);
      
      // Update local state
      setDoctor((prev) => ({
        ...prev,
        is_verified: true
      }));
      
      toast.success("Doctor verification successful!");
      
    } catch (err) {
      console.error("Error verifying doctor:", err);
      toast.error("Failed to verify doctor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#29AAE1]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center text-red-500 mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-[#29AAE1] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doctors List
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center text-red-500 mb-4">
            <p>Doctor not found</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-[#29AAE1] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doctors List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-[#29AAE1] hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctors List
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Doctor header */}
          <div className="bg-[#29AAE1] p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">
                  {doctor.user ? `Dr. ${doctor.user.first_name} ${doctor.user.last_name}` : 'Unknown Doctor'}
                </h1>
                <p className="opacity-80">{doctor.specialty || "General Practice"}</p>
              </div>
              <div className="bg-white text-gray-800 px-3 py-1 rounded-full flex items-center">
                {doctor.is_verified ? (
                  <>
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    <span className="text-green-500 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 text-yellow-500" size={16} />
                    <span className="text-yellow-500 font-medium">Not Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Doctor information */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {doctor.user ? `${doctor.user.first_name} ${doctor.user.last_name}` : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{doctor.user ? doctor.user.email : 'No email'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{doctor.user ? doctor.user.phone_number : 'No phone'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{doctor.address || "Not provided"}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Specialty</p>
                <p className="font-medium">{doctor.specialty || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium">{doctor.license_number || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Years of Experience</p>
                <p className="font-medium">{doctor.years_of_experience || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Days</p>
                <p className="font-medium">
                  {doctor.available_days && doctor.available_days.length > 0 
                    ? doctor.available_days.join(', ') 
                    : "Not specified"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Qualifications</p>
                <p className="font-medium">{doctor.qualifications || "Not provided"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Bio</p>
                <p className="font-medium">{doctor.bio || "No bio available"}</p>
              </div>
            </div>

            {/* Verification action */}
            {!doctor.is_verified && (
              <div className="mt-4">
                <button
                  onClick={handleVerifyDoctor}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Verify Doctor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes
DoctorViewPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default DoctorViewPage;
