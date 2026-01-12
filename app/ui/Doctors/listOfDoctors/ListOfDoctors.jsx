"use client";
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, MoreVertical, Upload, ChevronDown, CheckCircle, X } from "lucide-react";
import { doctorsAPI } from "../../../utils/api";
import { toast } from "react-toastify";
import { DoctorDetailsPopup } from "../viewDoctor/DoctorDetailsPopup";
import { directNavigate } from "../../../utils/router";
import AddDoctor from "../addDoctor/AddDoctor";

const ListOfDoctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorIdQuery, setDoctorIdQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeMenuRow, setActiveMenuRow] = useState(null);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setCurrentPage(1);
  };

  const handleDoctorIdSearch = (e) => {
    setDoctorIdQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
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

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `doctors_${new Date().toISOString().slice(0, 10)}.csv`);
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

  const exportToPdf = async () => {
    // Placeholder for PDF export functionality
    toast.info("Export to PDF feature coming soon");
  };

  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleAddDoctor = () => {
    setShowAddDoctorModal(true);
  };

  const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter((doctor) => {
    const fullName = doctor.user ?
      `${doctor.user.first_name} ${doctor.user.last_name}`.toLowerCase() : '';

    const email = doctor.user && doctor.user.email ?
      doctor.user.email.toLowerCase() : '';

    // Mock ID search for now as ID might be numeric or UUID
    const idMatch = doctor.id ? doctor.id.toString().includes(doctorIdQuery) : true;

    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    const matchesId = doctorIdQuery === "" || idMatch;

    // Mock status for now, assuming all are active if not specified
    const isActive = doctor.is_available !== false;
    const matchesStatus = statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);

    return matchesSearch && matchesId && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
        {error}
      </div>
    );
  } else if (currentDoctors.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No doctors found matching your filters
      </div>
    );
  } else {
    contentToRender = (
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left">
          <thead className="bg-[#FAFAFA]">
            <tr className="border-b border-gray-100">
              <th className="px-4 py-4 w-[50px]">
                  <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-[#29AAE1] focus:ring-[#29AAE1]"
                      />
                  </th>
              <th className="px-6 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap">Doctor's Name</th>
              <th className="px-4 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap hidden md:table-cell">Phone Number</th>
              <th className="px-6 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap hidden lg:table-cell">Email Address</th>
              <th className="px-4 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap hidden sm:table-cell">Specialty</th>
              <th className="px-6 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap hidden xl:table-cell">Experience</th>
              <th className="px-6 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap hidden xl:table-cell">Date Joined</th>
              <th className="px-6 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap hidden 2xl:table-cell">Last Active</th>
              <th className="px-4 py-4 text-[13px] font-bold text-gray-700 whitespace-nowrap">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {currentDoctors.map((doctor, index) => (
              <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-3 py-4 w-12 text-center">
                  <div
                    onClick={() => handleRowSelect(doctor.id)}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors mx-auto ${selectedRows.includes(doctor.id) ? "border-[#29AAE1] bg-[#29AAE1]" : "border-gray-200"
                      }`}
                  >
                    {selectedRows.includes(doctor.id) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-[#29AAE1] to-[#1A8BB9]">
                      {doctor.user?.first_name ? doctor.user.first_name[0] : "?"}
                    </div>
                    <span className="text-gray-900 font-medium text-[13.5px] whitespace-nowrap">
                      {doctor.user ? `${doctor.user.first_name} ${doctor.user.last_name}` : "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[13.5px] hidden md:table-cell font-medium">
                  {doctor.user ? doctor.user.phone_number : "-"}
                </td>
                <td className="px-6 py-4 text-[13.5px] hidden lg:table-cell font-medium">
                  {doctor.user ? doctor.user.email : "-"}
                </td>
                <td className="px-4 py-4 text-[13.5px] hidden sm:table-cell font-medium">
                  {doctor.specialty || "General Practitioner"}
                </td>
                <td className="px-6 py-4 text-[13.5px] hidden xl:table-cell font-medium">
                  {doctor.years_of_experience || doctor.experience_years || "8"} Years
                </td>
                <td className="px-6 py-4 text-[13.5px] hidden xl:table-cell font-medium">
                  16 Aug 2023
                </td>
                <td className="px-6 py-4 text-[13.5px] hidden 2xl:table-cell font-medium">
                  16 Aug 2023
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-md text-white text-[12px] font-medium w-20 inline-block text-center shadow-sm ${doctor.is_available !== false ? "bg-[#34A853]" : "bg-[#EA4335]"
                    }`}>
                    {doctor.is_available !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setActiveMenuRow(activeMenuRow === doctor.id ? null : doctor.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {activeMenuRow === doctor.id && (
                      <div className={`absolute right-0 w-44 bg-white rounded-lg shadow-xl z-20 border border-gray-100 py-2 animate-in fade-in slide-in-from-top-1 text-left ${index > 5 ? 'bottom-full mb-2' : 'mt-2'
                        }`}>
                        <button
                          onClick={() => { viewDoctorDetails(doctor); setActiveMenuRow(null); }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye size={16} className="mr-3 text-gray-400" /> View Details
                        </button>
                        <button
                          onClick={() => { directNavigate(`/dashboard/doctors/edit/${doctor.id}`); setActiveMenuRow(null); }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="mr-3 text-gray-400 text-lg">✎</span> Edit Profile
                        </button>
                        <div className="border-t border-gray-50 my-1"></div>
                        <button
                          onClick={async () => {
                            try {
                              await doctorsAPI.verifyDoctor(doctor.id, { is_verified: !doctor.is_verified });
                              toast.success(`Doctor ${doctor.is_verified ? "unverified" : "verified"} successfully`);
                              setDoctors(prev => prev.map(d => d.id === doctor.id ? { ...d, is_verified: !d.is_verified } : d));
                            } catch (err) {
                              toast.error("Action failed");
                            }
                            setActiveMenuRow(null);
                          }}
                          className={`flex items-center w-full px-4 py-2.5 text-sm ${doctor.is_verified ? "text-gray-600" : "text-blue-600"} hover:bg-gray-50`}
                        >
                          {doctor.is_verified ? <X size={16} className="mr-3 text-gray-400" /> : <CheckCircle size={16} className="mr-3 text-blue-500" />}
                          {doctor.is_verified ? "Unverify Doctor" : "Verify Doctor"}
                        </button>
                      </div>
                    )}
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
    <div className="p-8 bg-gray-50/30 min-h-screen">
      <h1 className="text-2xl font-bold text-[#7F375E] mb-8">List of Doctors</h1>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          {/* Search by Name */}
          <div className="flex-1 min-w-0">
            {/* <label className="block text-[13px] font-medium text-gray-500 mb-2">Search by Name</label> */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] outline-none text-gray-600 text-sm transition-all shadow-sm"
              />
              <Search className="absolute right-3.5 top-3 text-gray-400" size={18} />
            </div>
          </div>

          {/* Search by Doctor's ID */}
          <div className="flex-1 min-w-0">
            {/* <label className="block text-[13px] font-medium text-gray-500 mb-2">Search by Doctor's ID</label> */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Doctor's ID" 
                value={doctorIdQuery}
                onChange={handleDoctorIdSearch}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] outline-none text-gray-600 text-sm transition-all shadow-sm"
              />
              <Search className="absolute right-3.5 top-3 text-gray-400" size={18} />
            </div>
          </div>

          {/* Filter by Status */}
          <div className="w-full lg:w-[180px]">
            {/* <label className="block text-[13px] font-medium text-gray-500 mb-2">Filter by Status</label> */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] outline-none text-gray-600 text-sm transition-all shadow-sm"
              >
                <option value="All">Filter by status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-3 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 lg:ml-auto flex-wrap">
            <button
              onClick={exportToPdf}
              className="px-4 py-2 text-[12px] font-bold border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
            >
              Export PDF
              <Download size={14} className="text-gray-400" />
            </button>
            <button
              onClick={exportToCsv}
              disabled={isExporting}
              className="px-4 py-2 text-[12px] font-bold border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap shadow-sm"
            >
              Export CSV
              <Download size={14} className="text-gray-400" />
            </button>
            <button
              onClick={handleAddDoctor}
              className="px-5 py-2 text-[12px] font-bold bg-[#29AAE1] text-white rounded-lg hover:bg-[#2399c9] transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Add Doctor +
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {contentToRender}

        {/* Pagination Section */}
        {!isLoading && !error && filteredDoctors.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-8 py-5 bg-white border-t border-gray-50 gap-4">
            <div className="text-[13px] text-gray-400 italic font-medium text-center md:text-left">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} Results
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <span className="text-lg">←</span>
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first page, last page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${currentPage === page
                        ? "bg-[#7F375E] text-white"
                        : "border border-gray-100 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-1 text-gray-300">...</span>;
                }
                return null;
              }).filter(Boolean).reduce((acc, curr, idx, arr) => {
                // Remove consecutive dots
                if (curr.type === 'span' && arr[idx - 1]?.type === 'span') return acc;
                return [...acc, curr];
              }, [])}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedDoctor && (
        <DoctorDetailsPopup
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <AddDoctor onClose={() => setShowAddDoctorModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfDoctors;
