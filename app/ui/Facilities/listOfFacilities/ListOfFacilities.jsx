"use client";
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, FileText, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { healthcareFacilitiesAPI } from "../../../utils/api";
import { toast } from "react-toastify";
import ViewHospitalModal from "./ViewHospitalModal";
import AddHospitalModal from "./AddHospitalModal";

const ListOfFacilities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("Location");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  // Modal states
  const [viewModalData, setViewModalData] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11); // Matching screenshot showing "Showing 11 of 170 Results"

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await healthcareFacilitiesAPI.getAllFacilities();
      console.log("Facilities data:", data);
      setFacilities(data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setError("Failed to load healthcare facilities");
      toast.error("Failed to load facilities list");
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      // Mock PDF Export for now or use API if available
      toast.success("PDF Export started...");
      setTimeout(() => setIsExporting(false), 2000);
    } catch (error) {
      toast.error("Failed to export PDF");
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExportingCSV(true);
      const response = await healthcareFacilitiesAPI.exportFacilitiesToCsv();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hospitals_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export CSV");
    } finally {
      setIsExportingCSV(false);
    }
  };

  const openViewModal = (facility) => {
    setViewModalData(facility);
  };

  const closeViewModal = () => {
    setViewModalData(null);
  };

  const openAddModal = () => {
    setEditData(null);
    setAddModalOpen(true);
  };

  const openEditModal = (facility) => {
    setEditData(facility);
    setAddModalOpen(true);
    // If opening from view modal, close it
    if (viewModalData) setViewModalData(null);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setEditData(null);
  };

  const handleSaveHospital = async (formData) => {
    try {
      setIsLoading(true);
      if (editData) {
        // Update existing
        await healthcareFacilitiesAPI.updateFacility(editData.id, formData);
        toast.success("Hospital updated successfully");
      } else {
        // Create new (Mocking ID for optimistic update or refetch)
        await healthcareFacilitiesAPI.addFacility(formData);
        toast.success("New hospital added successfully");
      }
      await fetchFacilities();
      closeAddModal();
    } catch (error) {
      console.error("Error saving hospital:", error);
      toast.error(editData ? "Failed to update hospital" : "Failed to add hospital");
    } finally {
      setIsLoading(false);
    }
  };


  // Filter Logic
  const filteredFacilities = (Array.isArray(facilities) ? facilities : []).filter((facility) => {
    const facilityName = facility.name ? facility.name.toLowerCase() : '';
    const facilityAddress = facility.address ? facility.address.toLowerCase() : '';
    const matchesSearch = facilityName.includes(searchQuery.toLowerCase()) ||
      facilityAddress.includes(searchQuery.toLowerCase());
    return matchesSearch;
    // Add logic for Location and Status filters if data supports it
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFacilities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Page Title */}
      <h1 className="text-2xl font-medium text-[#7F375E] mb-6">List of Hospitals</h1>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Left Side: Search and Filters */}
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Facility"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7F375E]"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* Location Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
            >
              <option>Filter by Location</option>
              {/* Mock Locations */}
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
            >
              <option>Filter by Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export PDF
            <Download size={16} />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={isExportingCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export CSV
            <Download size={16} />
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#29AAE1] text-white rounded-lg text-sm hover:bg-[#2392c2] transition-colors shadow-sm"
          >
            Add New Hospital +
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#29AAE1]"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-12 text-red-500">
            {error}
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="flex justify-center items-center p-12 text-gray-500">
            No hospitals found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[20%]">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[20%]">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[15%]">Type</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-[#111827] uppercase tracking-wider w-[10%]">Total Beds</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[15%]">Contact</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#111827] uppercase tracking-wider w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((facility, index) => (
                <tr key={facility.id || index} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#111827]">
                      {facility.name || "LifeCare Hospital"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#374151]">
                      {facility.address || "UpperHill, Nairobi"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#374151]">
                      {facility.facility_type || "Hospital"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-[#374151]">
                      {facility.total_beds || "120"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#374151]">
                      {facility.phone || "+254 700 000000"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openViewModal(facility)}
                        className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] transition-colors text-sm font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(facility)}
                        className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] transition-colors text-sm font-medium"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-[#111827]">
          Showing {filteredFacilities.length > 0 ? indexOfFirstItem + 1 : 0} of {filteredFacilities.length} Results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="text-[#374151]" />
          </button>
          {/* Simple Pagination Logic - Can be expanded */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${currentPage === i + 1
                  ? "bg-[#8B3D5A] text-white border-[#8B3D5A]"
                  : "bg-white border-gray-200 text-[#374151] hover:bg-gray-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 5 && <span className="px-2 py-1 text-gray-500">...</span>}
          {totalPages > 5 && (
            <button
              onClick={() => paginate(totalPages)}
              className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${currentPage === totalPages
                  ? "bg-[#8B3D5A] text-white border-[#8B3D5A]"
                  : "bg-white border-gray-200 text-[#374151] hover:bg-gray-50"
                }`}
            >
              {totalPages}
            </button>
          )}


          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} className="text-[#374151]" />
          </button>
        </div>
      </div>

      {/* View Modal */}
      {viewModalData && (
        <ViewHospitalModal
          facility={viewModalData}
          onClose={closeViewModal}
          onEdit={openEditModal}
        />
      )}

      {/* Add/Edit Modal */}
      <AddHospitalModal
        isOpen={addModalOpen}
        onClose={closeAddModal}
        onSubmit={handleSaveHospital}
        initialData={editData}
      />

    </div>
  );
};

export default ListOfFacilities;
