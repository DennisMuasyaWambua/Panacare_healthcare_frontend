"use client";
import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import PropTypes from "prop-types";
import { packagesAPI } from "../../../utils/api";
import { toast } from "react-toastify";

const SubscriptionsList = ({ 
  packages, 
  loading, 
  error, 
  onRefresh, 
  onExportPdf, 
  onExportCsv 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#29AAE1]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Packages</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-[#29AAE1] text-white rounded hover:bg-[#1c8bbf]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md text-center">
        <p className="text-gray-600 mb-4">No subscription packages found.</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-[#29AAE1] text-white rounded hover:bg-[#1c8bbf]"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Packages grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 flex flex-col">
            {/* Package header */}
            <div className="bg-[#29AAE1] p-4 text-white">
              <h3 className="font-bold text-xl">{pkg.name}</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold">KES {pkg.price}</span>
                <span className="text-sm ml-1 opacity-80">/ {pkg.duration_days} days</span>
              </div>
            </div>

            {/* Package details */}
            <div className="p-4 flex-grow flex flex-col">
              <p className="text-gray-600 mb-4 text-sm">{pkg.description}</p>
              
              <div className="space-y-3 mb-4 flex-grow">
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-black">{pkg.duration_days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Consultation Limit:</span>
                  <span className="font-medium text-black">
                    {pkg.consultation_limit === -1 ? "Unlimited" : pkg.consultation_limit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${pkg.is_active ? 'text-green-500' : 'text-red-500'}`}>
                    {pkg.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                
                {/* Features */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1 text-sm">
                    {pkg.features && Object.entries(pkg.features).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        {value ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
                <button 
                  className="flex-1 px-3 py-2 bg-[#29AAE1] text-white text-sm rounded hover:bg-[#1c8bbf]"
                  onClick={() => {
                    // Use dynamic route for viewing package details
                    window.location.href = `/dashboard/subscriptions/view/${pkg.id}`;
                  }}
                >
                  View
                </button>
                <button 
                  className="flex-1 px-3 py-2 bg-[#7F375E] text-white text-sm rounded hover:bg-[#6a2c4e]"
                  onClick={() => {
                    // Edit function could be implemented here
                    // For now, just navigate to view page
                    window.location.href = `/dashboard/subscriptions/view/${pkg.id}`;
                  }}
                >
                  Edit
                </button>
                <button 
                  className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this package?")) {
                      try {
                        await packagesAPI.deletePackage(pkg.id);
                        toast.success("Package deleted successfully");
                        // Refresh the list
                        onRefresh();
                      } catch (err) {
                        console.error("Error deleting package:", err);
                        toast.error("Failed to delete package");
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onExportPdf}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Export PDF
        </button>
        <button
          onClick={onExportCsv}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
};

SubscriptionsList.propTypes = {
  packages: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
  onExportPdf: PropTypes.func.isRequired,
  onExportCsv: PropTypes.func.isRequired,
};

export default SubscriptionsList;
