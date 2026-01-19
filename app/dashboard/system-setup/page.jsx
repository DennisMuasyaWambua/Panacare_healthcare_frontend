"use client";
import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

const SystemSetupPage = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-[#7F375E] mb-6">System Setup</h1>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#29AAE1]">System Configuration</h2>
              <p className="text-gray-600 mb-4">
                This section will allow you to configure system-wide settings. Configuration options are coming soon.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-blue-700">
                  This feature is under development. Check back soon for updates!
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#29AAE1]">User Roles & Permissions</h2>
              <p className="text-gray-600 mb-4">
                Configure roles and permissions for different user types in the system.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-blue-700">
                  Role and permission management coming soon.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#29AAE1]">System Backup & Restore</h2>
              <p className="text-gray-600 mb-4">
                Backup system data and restore from previous backups.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-blue-700">
                  Backup and restore functionality will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SystemSetupPage;
