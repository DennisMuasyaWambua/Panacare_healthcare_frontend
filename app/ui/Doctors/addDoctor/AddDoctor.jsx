"use client";
import React, { useState } from "react";
import { X, Edit } from "lucide-react";
import { doctorsAPI, usersAPI } from "../../../utils/api";
import { toast } from "react-toastify";
import { directNavigate } from "../../../utils/router";
import SuccessModal from "../../common/SuccessModal";

const AddDoctor = ({ onClose }) => {
  const [formData, setFormData] = useState({
    license_number: "",
    salutation: "Mr",
    full_name: "",
    specialty: "Opthamologist",
    other_qualification: "",
    years_of_practice: "8 Years",
    phone_number: "",
    email: "",

    // Hidden/Default fields required by API but not in design
    username: "",
    password: "Password123!", // Default password
    address: "N/A",
    is_available: true,
    bio: ""
  });

  const [education, setEducation] = useState({
    level_of_education: "",
    field: "Opthamology",
    university: "",
    // API required fields
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
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
      // Split full name into first and last name for API
      const nameParts = formData.full_name.split(' ');
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(' ') || "";

      // Generate username from email or name if not provided
      const username = formData.email.split('@')[0] || firstName.toLowerCase();

      // Construct a single payload for the admin_add_doctor endpoint
      // This endpoint handles both user creation and doctor profile creation atomically
      const payload = {
        // User fields
        username: username,
        email: formData.email,
        password: formData.password || "Password123!",
        first_name: firstName,
        last_name: lastName,
        phone_number: formData.phone_number,
        address: formData.address || "N/A",

        // Doctor fields
        specialty: formData.specialty,
        license_number: formData.license_number,
        experience_years: parseInt(formData.years_of_practice) || 0,
        bio: formData.bio + (formData.other_qualification ? `\nOther Qualifications: ${formData.other_qualification}` : ""),
        is_available: formData.is_available,

        // Education (Nested object)
        education: {
          level_of_education: education.level_of_education || "Bachelor's",
          field: education.field || "Medicine",
          institution: education.university || "University of Nairobi",
          start_date: education.start_date,
          end_date: education.end_date
        }
      };

      console.log("Submitting doctor creation payload...", payload);

      // Use the admin endpoint which creates both user and doctor profile
      await doctorsAPI.addDoctor(payload);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding doctor:", error);

      let errorMessage = error.message || "Failed to add doctor";

      // Parse backend field-specific errors
      if (error.response && typeof error.response === 'object') {
        const fieldErrors = [];
        Object.entries(error.response).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            fieldErrors.push(`${key}: ${value.join(', ')}`);
          } else if (typeof value === 'string') {
            fieldErrors.push(`${key}: ${value}`);
          }
        });

        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join('\n');
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    if (onClose) {
      onClose();
    } else {
      directNavigate("/dashboard/doctors");
    }
  };

  return (
    <div className={`p-8 bg-gray-50 ${onClose ? '' : 'min-h-screen'} relative font-sans`}>
      {/* Header */}
      {!onClose && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>List of Doctors</span>
            <span>/</span>
            <span className="text-[#AF3065] font-medium">New Doctor</span>
          </div>
        </div>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      )}

      <h1 className="text-xl font-medium text-[#AF3065] mb-6">Doctor's Details</h1>

      <form onSubmit={handleSubmit} className="max-w-6xl">
        {/* Bio Details Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-[#29AAE1] text-lg font-medium mb-6">Bio Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            {/* Row 1 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Doctor's License Number</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                placeholder="Enter Registration Number"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Salutation</label>
              <div className="relative">
                <select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm appearance-none"
                >
                  <option value="Mr">Dr./Prof./Mr.</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Full name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Dr. Jude Doe"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm placeholder-gray-400"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Speciality</label>
              <div className="relative">
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm appearance-none"
                >
                  <option value="Gynaecologist">Gynaecologist</option>
                  <option value="Opthamologist">Opthamologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Other qualification (Optional)</label>
              <div className="relative">
                <select
                  name="other_qualification"
                  value={formData.other_qualification}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm appearance-none"
                >
                  <option value="">Select Qualification</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Surgeon">Surgeon</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Years of practice</label>
              <div className="relative">
                <select
                  name="years_of_practice"
                  value={formData.years_of_practice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm appearance-none"
                >
                  <option value="8 Years">8 Years</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+254 700 000000"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Sample@Email.Com"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Education Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-[#29AAE1] text-lg font-medium mb-6">Education</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Level of Education</label>
              <div className="relative">
                <select
                  value={education.level_of_education}
                  onChange={(e) => handleEducationChange('level_of_education', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm appearance-none"
                >
                  <option value="">Level Of Education</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Field</label>
              <div className="relative">
                <select
                  value={education.field}
                  onChange={(e) => handleEducationChange('field', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm appearance-none"
                >
                  <option value="Opthamology">Gynaecology</option>
                  <option value="Opthamology">Opthamology</option>
                  <option value="Medicine">Medicine</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">University/Collage</label>
              <div className="relative">
                <select
                  value={education.university}
                  onChange={(e) => handleEducationChange('university', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 text-sm appearance-none"
                >
                  <option value="">Select University</option>
                  <option value="University of Nairobi">University of Nairobi</option>
                  <option value="Kenyatta University">Kenyatta University</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2 bg-[#7F375E] text-white rounded-md hover:bg-[#6d2f50] font-medium text-sm transition-colors"
          >
            <span className="text-lg">+</span> Add
          </button>
        </div>

        {/* Submit Button - Centered */}
        <div className="flex justify-center pb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-16 py-3 bg-[#29AAE1] text-white rounded-full hover:bg-blue-600 disabled:opacity-70 font-medium text-lg shadow-md transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Reusable Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default AddDoctor;