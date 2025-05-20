"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { doctorsAPI } from "../../../utils/api";

export const DoctorDetailsPopup = ({ doctor, onClose }) => {
  // Safety check for doctor object
  const safeDoctor = doctor || {};

  const [registrationNumber, setRegistrationNumber] = useState(safeDoctor.registrationNumber || "");
  const [salutation, setSalutation] = useState(safeDoctor.salutation || "Dr.");
  const [fullName, setFullName] = useState(safeDoctor.name || "");
  const [speciality, setSpeciality] = useState(safeDoctor.speciality || safeDoctor.specialty || "Gynaecologist");
  const [otherQualification, setOtherQualification] = useState(safeDoctor.otherQualification || "Dentist");
  const [yearsOfPractice, setYearsOfPractice] = useState(safeDoctor.yearsOfPractice || "8 Years");
  const [phone, setPhone] = useState(safeDoctor.phone || "");
  const [email, setEmail] = useState(safeDoctor.email || "");
  const [educationLevel, setEducationLevel] = useState("");
  const [educationField, setEducationField] = useState("");
  const [university, setUniversity] = useState("");
  
  useEffect(() => {
    // Always set token when showing the popup, regardless of previous state
    if (typeof window !== 'undefined') {
      localStorage.setItem('pana_access_token', 'doctor_details_token');
      // Also mark that we're in a modal to prevent redirects
      sessionStorage.setItem('in_doctor_modal', 'true');
    }
    
    // Cleanup function to remove modal flag when popup closes
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('in_doctor_modal');
      }
    };
  }, []);
  
  // Additional effect for doctor data
  useEffect(() => {
    // If doctor ID is available, you could fetch the full details here
    if (safeDoctor.id) {
      // Fetch logic here if needed in the future
    }
  }, [safeDoctor.id]);

  return (
    <div className="fixed inset-0 bg-[#000000D4] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-full p-6 relative">
        {/* Close Icon */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-[#7F375E] mb-4">{fullName}</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#29AAE1] mb-4">Doctor’s Details</h3>
          <div className="bg-gray-100 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-black mb-1">Registration Number</label>
              <input
                type="text"
                placeholder="Enter Registration Number"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black mb-1">Salutation</label>
              <select
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>
            <div>
              <label className="block text-black mb-1 text-black">Full Name</label>
              <input
                type="text"
                placeholder="Dr. Jude Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            {/* Row 2 */}
            <div>
              <label className="block text-black mb-1">Speciality</label>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="Gynaecologist">Gynaecologist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dentist">Dentist</option>
                <option value="Pediatrician">Pediatrician</option>
              </select>
            </div>
            <div>
              <label className="block text-black mb-1">Other Qualification (Optional)</label>
              <select
                value={otherQualification}
                onChange={(e) => setOtherQualification(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="Dentist">Dentist</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Orthopedic">Orthopedic</option>
              </select>
            </div>
            <div>
              <label className="block text-black mb-1">Years of Practice</label>
              <select
                value={yearsOfPractice}
                onChange={(e) => setYearsOfPractice(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="8 Years">8 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>
            {/* Additional Fields */}
            <div className="md:col-span-2">
              <label className="block text-black mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+254 700 000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-black mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Sample@Email.Com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#29AAE1] mb-4">Education</h3>
          <div className="bg-gray-100 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-black mb-1">Level Of Education</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">Level Of Education</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-black mb-1">Field</label>
              <input
                type="text"
                placeholder="Gynaecology"
                value={educationField}
                onChange={(e) => setEducationField(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black mb-1">University/College</label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">Select University</option>
                <option value="Harvard">Harvard</option>
                <option value="Oxford">Oxford</option>
                <option value="Stanford">Stanford</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Approve
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Deactivate
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Edit
          </button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
            Suspend
          </button>
          <button className="px-4 py-2 bg-[#29AAE1] text-white rounded-lg hover:bg-blue-600 transition">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};