"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { doctorsAPI } from "../../../utils/api";
import { toast } from "react-toastify";
import { directNavigate } from "../../../utils/router";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    specialty: "Cardiology",
    license_number: "",
    experience_years: 1,
    bio: "",
    is_available: true
  });
  
  const [education, setEducation] = useState({
    level_of_education: "Bachelor's",
    field: "Medicine",
    institution: "",
    start_date: "",
    end_date: ""
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEducationChange = (field, value) => {
    setEducation({
      ...education,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare the data for the API call
      const doctorData = {
        ...formData,
        education: education,
        // Convert experience_years to number
        experience_years: parseInt(formData.experience_years, 10)
      };
      
      // Call the API to add a doctor
      await doctorsAPI.addDoctor(doctorData);
      
      toast.success("Doctor added successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding doctor:", error);
      setError(error.message || "Failed to add doctor");
      toast.error(error.message || "Failed to add doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    directNavigate("/dashboard/doctors");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold text-[#7F375E] mb-6">Add Doctor</h1>

      <form onSubmit={handleSubmit}>
        {/* Doctor's Account Information Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#29AAE1] mb-4">Account Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="username" className="block text-black mb-2">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="doctor_username"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-black mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="doctor@example.com"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-black mb-2">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter secure password"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Doctor's Personal Details Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#29AAE1] mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="first_name" className="block text-black mb-2">First Name</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-black mb-2">Last Name</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="phone_number" className="block text-black mb-2">Phone Number</label>
              <input
                id="phone_number"
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-black mb-2">Address</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Doctor's Professional Details Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#29AAE1] mb-4">Professional Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="specialty" className="block text-black mb-2">Specialty</label>
              <select 
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Neurology">Neurology</option>
                <option value="Obstetrics">Obstetrics</option>
                <option value="Oncology">Oncology</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Urology">Urology</option>
                <option value="General Practice">General Practice</option>
              </select>
            </div>
            <div>
              <label htmlFor="license_number" className="block text-black mb-2">License Number</label>
              <input
                id="license_number"
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                placeholder="MED12345"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="experience_years" className="block text-black mb-2">Years of Experience</label>
              <input
                id="experience_years"
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleInputChange}
                min="0"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="is_available" className="block text-black mb-2">Availability Status</label>
              <select
                id="is_available"
                name="is_available"
                value={formData.is_available}
                onChange={(e) => setFormData({...formData, is_available: e.target.value === 'true'})}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-black mb-2">Bio / Professional Summary</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Brief professional biography or summary of expertise"
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#29AAE1] mb-4">Education</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="level_of_education" className="block text-black mb-2">Level of Education</label>
              <select 
                id="level_of_education"
                value={education.level_of_education}
                onChange={(e) => handleEducationChange('level_of_education', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
              >
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="Doctorate">Doctorate</option>
                <option value="PhD">PhD</option>
                <option value="Fellowship">Fellowship</option>
              </select>
            </div>
            <div>
              <label htmlFor="field" className="block text-black mb-2">Field</label>
              <input
                id="field"
                type="text"
                value={education.field}
                onChange={(e) => handleEducationChange('field', e.target.value)}
                placeholder="Medicine, Surgery, etc."
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="institution" className="block text-black mb-2">Institution</label>
              <input
                id="institution"
                type="text"
                value={education.institution}
                onChange={(e) => handleEducationChange('institution', e.target.value)}
                placeholder="University/College name"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="start_date" className="block text-black mb-2">Start Date</label>
              <input
                id="start_date"
                type="date"
                value={education.start_date}
                onChange={(e) => handleEducationChange('start_date', e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-black mb-2">End Date</label>
              <input
                id="end_date"
                type="date"
                value={education.end_date}
                onChange={(e) => handleEducationChange('end_date', e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#29AAE1] text-white rounded-lg disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Add Doctor"}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </form>

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
                onClick={() => {
                  setShowSuccessModal(false);
                  directNavigate("/dashboard/doctors");
                }}
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