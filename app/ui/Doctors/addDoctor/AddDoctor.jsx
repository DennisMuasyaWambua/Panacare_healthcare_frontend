"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

const AddDoctor = () => {
  const [educationEntries, setEducationEntries] = useState([
    { level: "", field: "", university: "" },
  ]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAddEducation = () => {
    setEducationEntries([...educationEntries, { level: "", field: "", university: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful submission
    setShowSuccessModal(true);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold text-[#7F375E] mb-6">Add Doctor</h1>

      {/* Doctor's Details Section */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#29AAE1] mb-4">Doctor’s Details</h2>

        {/* Bio Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Row 1 */}
          <div>
            <label className="block text-black mb-2">Doctor’s Registration Number</label>
            <input
              type="text"
              placeholder="Enter Registration Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black mb-2">Salutation</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
            </select>
          </div>
          <div>
            <label className="block text-black mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Dr. Jude Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-black mb-2">Speciality</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
              <option value="Gynaecologist">Gynaecologist</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Pediatrician">Pediatrician</option>
            </select>
          </div>
          <div>
            <label className="block text-black mb-2">Other Qualification (Optional)</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
              <option value="Dentist">Dentist</option>
              <option value="Surgeon">Surgeon</option>
              <option value="Orthopedic">Orthopedic</option>
            </select>
          </div>
          <div>
            <label className="block text-black mb-2">Years of Practice</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
              <option value="1 Year">1 Year</option>
              <option value="5 Years">5 Years</option>
              <option value="8 Years">8 Years</option>
              <option value="10+ Years">10+ Years</option>
            </select>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-black mb-2">Phone Number</label>
            <input
              type="text"
              placeholder="+254 700 000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Sample@Email.Com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#29AAE1] mb-4">Education</h2>

        {educationEntries.map((entry, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-black mb-2">Level of Education</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-black mb-2">Field</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
                <option value="Gynaecology">Gynaecology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dentistry">Dentistry</option>
              </select>
            </div>
            <div>
              <label className="block text-black mb-2">University/College</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
                <option value="Harvard">Harvard</option>
                <option value="Oxford">Oxford</option>
                <option value="Stanford">Stanford</option>
              </select>
            </div>
          </div>
        ))}

        {/* Add Education Button */}
        <button
          onClick={handleAddEducation}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center"
        >
          <span className="mr-2">+ Add</span>
        </button>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-[#29AAE1] text-white rounded-lg"
        >
          Submit
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#000000D4] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              <X size={24} />
            </button>

            {/* Success Message */}
            <h2 className="text-lg font-bold text-[#7F375E] mb-4">Success</h2>
            <p className="text-black mb-4">Doctor has been successfully added!</p>

            {/* OK Button */}
            <div className="text-center">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-[#29AAE1] text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDoctor;