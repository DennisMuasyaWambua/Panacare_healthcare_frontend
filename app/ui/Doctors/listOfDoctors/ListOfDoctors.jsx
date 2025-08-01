"use client";
import React, { useState, useEffect } from "react";
import { Search, MoreVertical, X, AlertCircle, FileText, Download, Eye, CheckCircle, XCircle } from "lucide-react";
import { doctorsAPI } from "../../../utils/api";
import { toast } from "react-toastify";
import { DoctorDetailsPopup } from "../viewDoctor/DoctorDetailsPopup";

const ListOfDoctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await doctorsAPI.getAllDoctors();
        console.log("Doctor data:", data);
        setDoctors(data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors");
        toast.error("Failed to load doctors list");
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSpecialtyFilter = (e) => {
    setSpecialtyFilter(e.target.value);
  };

  const handleVerificationFilter = (e) => {
    setVerificationFilter(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setVerificationFilter(e.value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  
  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      const response = await doctorsAPI.exportDoctorsToCsv();
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `doctors_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success("Doctors data exported successfully");
    } catch (error) {
      console.error("Error exporting doctors data:", error);
      toast.error("Failed to export doctors data");
    } finally {
      setIsExporting(false);
    }
  };

  const verifyDoctor = async (doctorId) => {
    try {
      await doctorsAPI.verifyDoctor(doctorId);
      toast.success("Doctor verification successful");
      
      // Update the doctors list
      const updatedDoctors = doctors.map(doctor => {
        if (doctor.id === doctorId) {
          return { ...doctor, is_verified: true };
        }
        return doctor;
      });
      
      setDoctors(updatedDoctors);
      
      // If the doctor is selected, update selected doctor data too
      if (selectedDoctor && selectedDoctor.id === doctorId) {
        setSelectedDoctor({ ...selectedDoctor, is_verified: true });
      }
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error("Failed to verify doctor");
    }
  };

  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter((doctor) => {
    // Get doctor name from nested user object
    const fullName = doctor.user ? 
      `${doctor.user.first_name} ${doctor.user.last_name}`.toLowerCase() : '';
    
    // Check if doctor email contains search query
    const email = doctor.user && doctor.user.email ? 
      doctor.user.email.toLowerCase() : '';
    
    const specialtyMatch = doctor.specialty ? doctor.specialty.toLowerCase() : '';
    
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                         email.includes(searchQuery.toLowerCase()) ||
                         specialtyMatch.includes(searchQuery.toLowerCase());
    
    // Filter by specialty
    const matchesSpecialty = specialtyFilter === "All" || 
                            doctor.specialty === specialtyFilter;
    
    // Filter by verification status
    const matchesVerification = verificationFilter === "All" || 
                              (verificationFilter === "Verified" && doctor.is_verified) ||
                              (verificationFilter === "Not Verified" && !doctor.is_verified);

    return matchesSearch && matchesSpecialty && matchesVerification;
  });

  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty).filter(Boolean))];

  // Render content based on loading/error state
  let contentToRender;
  
  if (isLoading) {
    contentToRender = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading doctors...</p>
      </div>
    );
  } else if (error) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  } else if (filteredDoctors.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No doctors found matching your filters
      </div>
    );
  } else {
    contentToRender = (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-lg border-gray-300"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Specialty
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                License No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Verification
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id} className={selectedRows.includes(doctor.id) ? "bg-[#29AAE140]" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(doctor.id)}
                    onChange={() => handleRowSelect(doctor.id)}
                    className="w-4 h-4 rounded-lg border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-black">
                        {doctor.user && doctor.user.first_name ? doctor.user.first_name[0] : '?'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doctor.user ? `${doctor.user.first_name} ${doctor.user.last_name}` : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{doctor.user ? doctor.user.email : 'No email'}</div>
                  <div className="text-sm text-gray-500">{doctor.user ? doctor.user.phone_number : 'No phone'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doctor.specialty || "Not specified"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doctor.license_number || "Not provided"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doctor.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {doctor.is_verified ? "Verified" : "Not Verified"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {!doctor.is_verified && (
                      <button
                        onClick={() => verifyDoctor(doctor.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Verify Doctor"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => viewDoctorDetails(doctor)}
                      className="text-[#29AAE1] hover:text-blue-700"
                      title="View Doctor Details"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Title and Export Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#7F375E]">List of Doctors</h1>
        <button
          onClick={exportToCsv}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#29AAE1] text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          <Download size={18} />
          {isExporting ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search by Name or Email */}
        <div>
          <label htmlFor="nameSearch" className="block text-black mb-2">Search by Name, Email, or Specialty</label>
          <div className="relative">
            <input
              id="nameSearch"
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Filter by Specialty */}
        <div>
          <label htmlFor="specialtyFilter" className="block text-black mb-2">Filter by Specialty</label>
          <div className="relative">
            <select
              id="specialtyFilter"
              value={specialtyFilter}
              onChange={handleSpecialtyFilter}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="All">All Specialties</option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter by Verification Status */}
        <div>
          <label htmlFor="verificationFilter" className="block text-black mb-2">Filter by Verification</label>
          <div className="relative">
            <select
              id="verificationFilter"
              value={verificationFilter}
              onChange={handleVerificationFilter}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Verified">Verified</option>
              <option value="Not Verified">Not Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {contentToRender}
      </div>

      {/* Doctor Details Popup */}
      {selectedDoctor && (
        <DoctorDetailsPopup 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
          onVerify={verifyDoctor}
        />
      )}
    </div>
  );
};

export default ListOfDoctors;
