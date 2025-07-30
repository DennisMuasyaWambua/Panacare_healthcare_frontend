"use client";
import React, { useState, useEffect } from "react";
import { Search, MoreVertical, X, AlertCircle, FileText, Download, Eye, MapPin } from "lucide-react";
import { healthcareFacilitiesAPI } from "../../../utils/api";
import { toast } from "react-toastify";

const ListOfFacilities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [facilities, setFacilities] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalFacility, setModalFacility] = useState(null); // State for modal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
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

    fetchFacilities();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const openModal = (facility) => {
    setModalFacility(facility);
  };

  const closeModal = () => {
    setModalFacility(null);
  };
  
  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      const response = await healthcareFacilitiesAPI.exportFacilitiesToCsv();
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `healthcare_facilities_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success("Healthcare facilities data exported successfully");
    } catch (error) {
      console.error("Error exporting facilities data:", error);
      toast.error("Failed to export facilities data");
    } finally {
      setIsExporting(false);
    }
  };

  const viewFacilityDetails = (facilityId) => {
    // Navigate to facility details page
    window.location.href = `/dashboard/facilities/view/${facilityId}`;
  };

  const filteredFacilities = (Array.isArray(facilities) ? facilities : []).filter((facility) => {
    // Check if facility name contains search query
    const facilityName = facility.name ? facility.name.toLowerCase() : '';
    const facilityAddress = facility.address ? facility.address.toLowerCase() : '';
    
    const matchesSearch = facilityName.includes(searchQuery.toLowerCase()) || 
                         facilityAddress.includes(searchQuery.toLowerCase());
    
    // Filter by facility type
    const matchesType = typeFilter === "All" || 
                      facility.facility_type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Get unique facility types for filter
  const facilityTypes = [...new Set(facilities.map(facility => facility.facility_type).filter(Boolean))];

  // Render content based on loading/error state
  let contentToRender;
  
  if (isLoading) {
    contentToRender = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading facilities...</p>
      </div>
    );
  } else if (error) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  } else if (filteredFacilities.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No facilities found matching your filters
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
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFacilities.map((facility) => (
              <tr key={facility.id} className={selectedRows.includes(facility.id) ? "bg-[#29AAE140]" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(facility.id)}
                    onChange={() => handleRowSelect(facility.id)}
                    className="w-4 h-4 rounded-lg border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-[#29AAE1]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {facility.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {facility.facility_type || "General"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {facility.address || "No address provided"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{facility.phone || "No phone"}</div>
                  <div className="text-sm text-gray-500">{facility.email || "No email"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openModal(facility)}
                    className="text-[#29AAE1] hover:text-blue-700"
                    title="View Details"
                  >
                    <Eye size={20} />
                  </button>
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
        <h1 className="text-2xl font-bold text-[#7F375E]">Healthcare Facilities</h1>
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
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search by Name or Address */}
        <div>
          <label htmlFor="facilitySearch" className="block text-black mb-2">Search by Name or Address</label>
          <div className="relative">
            <input
              id="facilitySearch"
              type="text"
              placeholder="Search facilities..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Filter by Facility Type */}
        <div>
          <label htmlFor="typeFilter" className="block text-black mb-2">Filter by Facility Type</label>
          <div className="relative">
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={handleTypeFilter}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="All">All Facility Types</option>
              {facilityTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {contentToRender}
      </div>

      {/* Facility Details Modal */}
      {modalFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#7F375E]">{modalFacility.name}</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            {/* Facility Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Facility Type</p>
                <p className="font-semibold">{modalFacility.facility_type || "General"}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number</p>
                <p className="font-semibold">{modalFacility.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{modalFacility.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500">Website</p>
                <p className="font-semibold">
                  {modalFacility.website ? (
                    <a href={modalFacility.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {modalFacility.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-semibold">{modalFacility.address || "Not provided"}</p>
              </div>
              {modalFacility.description && (
                <div className="col-span-2">
                  <p className="text-gray-500">Description</p>
                  <p className="font-semibold">{modalFacility.description}</p>
                </div>
              )}
              {modalFacility.operating_hours && (
                <div className="col-span-2">
                  <p className="text-gray-500">Operating Hours</p>
                  <p className="font-semibold">{modalFacility.operating_hours}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={() => viewFacilityDetails(modalFacility.id)}
                className="px-4 py-2 bg-[#29AAE1] text-white rounded"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfFacilities;
