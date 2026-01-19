"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Loader2 } from "lucide-react";
import { packagesAPI } from "../../../../utils/api";
import { directNavigate } from "../../../../utils/router";
import { toast } from "react-toastify";

const SubscriptionViewPage = ({ params }) => {
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const packageId = params.id;
        
        const data = await packagesAPI.getPackageById(packageId);
        setPackageData(data);
      } catch (err) {
        console.error("Error fetching package details:", err);
        setError("Failed to load package details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [params.id]);

  const handleBack = () => {
    directNavigate("/dashboard/subscriptions");
  };

  const handleUpdate = () => {
    toast.info("Update feature coming soon!");
  };

  const handleDelete = async () => {
    if (!packageData || !packageData.id) return;
    
    if (window.confirm("Are you sure you want to delete this subscription package?")) {
      try {
        await packagesAPI.deletePackage(packageData.id);
        toast.success("Package deleted successfully");
        directNavigate("/dashboard/subscriptions");
      } catch (err) {
        console.error("Error deleting package:", err);
        toast.error("Failed to delete package");
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
            Back to Subscriptions List
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center text-red-500 mb-4">
            <p>Package not found</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-[#29AAE1] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subscriptions List
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
          Back to Subscriptions List
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Package header */}
          <div className="bg-[#29AAE1] p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{packageData.name}</h1>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-bold">KES {packageData.price}</span>
                  <span className="text-sm ml-1 opacity-80">/ {packageData.duration_days} days</span>
                </div>
              </div>
              <div className="bg-white text-gray-800 px-3 py-1 rounded-full">
                <span className={`font-medium ${packageData.is_active ? 'text-green-500' : 'text-red-500'}`}>
                  {packageData.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Package information */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Package Details</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-800">{packageData.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Basic Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-500">Price:</div>
                    <div className="text-black font-medium">KES {packageData.price}</div>
                    
                    <div className="text-gray-500">Duration:</div>
                    <div className="text-black font-medium">{packageData.duration_days} days</div>
                    
                    <div className="text-gray-500">Consultation Limit:</div>
                    <div className="text-black font-medium">
                      {packageData.consultation_limit === -1 ? "Unlimited" : packageData.consultation_limit}
                    </div>
                    
                    <div className="text-gray-500">Status:</div>
                    <div className={`font-medium ${packageData.is_active ? 'text-green-500' : 'text-red-500'}`}>
                      {packageData.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Features</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="space-y-2">
                    {packageData.features && Object.entries(packageData.features).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        {value ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-gray-800">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-[#7F375E]">Package Management</h2>
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-[#29AAE1] text-white rounded-md hover:bg-[#1c8bbf]"
                >
                  Edit Package
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SubscriptionViewPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default SubscriptionViewPage;
