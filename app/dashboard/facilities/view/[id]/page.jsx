"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Loader2, MapPin, Phone, Mail, Globe, Edit, Trash2 } from "lucide-react";
import { healthcareFacilitiesAPI } from "../../../../utils/api";
import { directNavigate } from "../../../../utils/router";
import { toast } from "react-toastify";

const FacilityViewPage = ({ params }) => {
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        setLoading(true);
        // The [id] from the dynamic route segment
        const facilityId = params.id;
        
        // In a real implementation, this would call an API
        const data = await healthcareFacilitiesAPI.getFacilityById(facilityId);
        setFacility(data);
      } catch (err) {
        console.error("Error fetching facility details:", err);
        setError("Failed to load facility details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [params.id]);

  const handleBack = () => {
    directNavigate("/dashboard/facilities");
  };
  
  const handleEdit = () => {
    toast.info("Edit feature coming soon!");
  };
  
  const handleDelete = async () => {
    if (!facility || !facility.id) return;
    
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await healthcareFacilitiesAPI.deleteFacility(facility.id);
        toast.success("Facility deleted successfully");
        directNavigate("/dashboard/facilities");
      } catch (err) {
        console.error("Error deleting facility:", err);
        toast.error("Failed to delete facility");
      }
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
            Back to Facilities List
          </button>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center text-red-500 mb-4">
            <p>Facility not found</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-[#29AAE1] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Facilities List
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
          Back to Facilities List
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Facility header */}
          <div className="bg-[#29AAE1] p-6 text-white">
            <h1 className="text-2xl font-bold">{facility.name || 'Unknown Facility'}</h1>
            <p className="opacity-80 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {facility.address || "No address provided"}
            </p>
          </div>

          {/* Facility information */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Facility Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Facility Name</p>
                <p className="font-medium">{facility.name || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Facility Type</p>
                <p className="font-medium">{facility.facility_type || "Not specified"}</p>
              </div>
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{facility.phone_number || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{facility.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="font-medium">
                    {facility.website ? (
                      <a 
                        href={facility.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#29AAE1] hover:underline"
                      >
                        {facility.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Operating Hours</p>
                <p className="font-medium">{facility.operating_hours || "Not specified"}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Additional Information</h2>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Services Offered</p>
                <p className="font-medium">{facility.services_offered || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{facility.description || "No description available"}</p>
              </div>
              {facility.insurance_accepted && (
                <div>
                  <p className="text-sm text-gray-500">Insurance Accepted</p>
                  <p className="font-medium">{facility.insurance_accepted}</p>
                </div>
              )}
              {facility.specialties && (
                <div>
                  <p className="text-sm text-gray-500">Specialties</p>
                  <p className="font-medium">{facility.specialties}</p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Facility Management</h2>
              <div className="flex space-x-4">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-[#29AAE1] text-white rounded-md hover:bg-[#1c8bbf] flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Facility
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FacilityViewPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default FacilityViewPage;
