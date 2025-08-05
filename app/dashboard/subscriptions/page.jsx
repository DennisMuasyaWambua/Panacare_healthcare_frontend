"use client";
import React, { useEffect, useState } from "react";
import { packagesAPI } from "../../utils/api";
import SubscriptionsList from "../../ui/Subscriptions/listOfSubscriptions/SubscriptionsList";
import AddSubscription from "../../ui/Subscriptions/addSubscription/AddSubscription";
import { toast } from "react-toastify";

const SubscriptionsPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await packagesAPI.getAllPackages();
        
        if (data && Array.isArray(data)) {
          setPackages(data);
        } else {
          setError("Unable to fetch packages");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load subscription packages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [refreshTrigger]);

  const handleAddPackage = async (packageData) => {
    try {
      await packagesAPI.addPackage(packageData);
      setShowAddSubscription(false);
      // Refresh the packages list
      setRefreshTrigger(prev => prev + 1);
      toast.success("Subscription package added successfully!");
    } catch (err) {
      console.error("Error adding package:", err);
      toast.error("Failed to add subscription package");
    }
  };

  const handleExportToPdf = async () => {
    try {
      const response = await packagesAPI.exportPackagesToPdf();
      
      // Create a blob from the response
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscription_packages_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF export successful");
    } catch (err) {
      console.error("Error exporting to PDF:", err);
      toast.error("Failed to export to PDF");
    }
  };

  const handleExportToCsv = async () => {
    try {
      const response = await packagesAPI.exportPackagesToCsv();
      
      // Create a blob from the response
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscription_packages_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("CSV export successful");
    } catch (err) {
      console.error("Error exporting to CSV:", err);
      toast.error("Failed to export to CSV");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Subscription Packages</h1>
          <button
            onClick={() => setShowAddSubscription(true)}
            className="px-4 py-2 bg-[#29AAE1] text-white rounded hover:bg-[#1c8bbf] flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Package
          </button>
        </div>

        {/* Main content */}
        <SubscriptionsList 
          packages={packages} 
          loading={loading} 
          error={error} 
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
          onExportPdf={handleExportToPdf}
          onExportCsv={handleExportToCsv}
        />

        {/* Add Subscription Modal */}
        {showAddSubscription && (
          <AddSubscription
            onClose={() => setShowAddSubscription(false)}
            onSubmit={handleAddPackage}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
