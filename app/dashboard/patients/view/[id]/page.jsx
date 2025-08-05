"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { patientsAPI } from "../../../../utils/api";
import { directNavigate } from "../../../../utils/router";

const PatientViewPage = ({ params }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        // The [id] from the dynamic route segment
        const patientId = params.id;
        
        // In a real implementation, this would call an API
        // For now, we'll simulate getting patient data
        const data = await patientsAPI.getPatientById(patientId);
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setError("Failed to load patient details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [params.id]);

  const handleBack = () => {
    directNavigate("/dashboard/patients");
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
            Back to Patients List
          </button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center text-red-500 mb-4">
            <p>Patient not found</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-[#29AAE1] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients List
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
          Back to Patients List
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Patient header */}
          <div className="bg-[#29AAE1] p-6 text-white">
            <h1 className="text-2xl font-bold">
              {patient.user ? `${patient.user.first_name} ${patient.user.last_name}` : 'Unknown Patient'}
            </h1>
            <p className="opacity-80">Patient ID: {patient.id}</p>
          </div>

          {/* Patient information */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {patient.user ? `${patient.user.first_name} ${patient.user.last_name}` : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{patient.user ? patient.user.email : 'No email'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{patient.user ? patient.user.phone_number : 'No phone'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{patient.date_of_birth || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{patient.gender || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="font-medium">{patient.blood_type || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    patient.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {patient.active ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{patient.address || "Not provided"}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">
                  {patient.doctor_id ? `Dr. ID: ${patient.doctor_id}` : "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Allergies</p>
                <p className="font-medium">{patient.allergies || "None reported"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Medical History</p>
                <p className="font-medium">{patient.medical_history || "No medical history recorded"}</p>
              </div>
            </div>

            {/* Additional sections can be added as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientViewPage;
