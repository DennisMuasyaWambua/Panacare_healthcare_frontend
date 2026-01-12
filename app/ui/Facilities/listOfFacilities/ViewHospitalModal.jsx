"use client";
import React from "react";
import { X, Edit } from "lucide-react";

const ViewHospitalModal = ({ facility, onClose, onEdit }) => {
    if (!facility) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 rounded-full border border-black hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-black" />
                </button>

                <h2 className="text-2xl font-bold text-[#111827] mb-8">{facility.name || "Hospital DETAILS"}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                    {/* Row 1 */}
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Registration Number</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.registration_number || "N/A"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Established in</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.established_year || "2010"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Phone Number</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.phone || "Enter Number"}
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Enter Email Address</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.email || "johndoe@example.com"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Total Beds</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.total_beds || "2010"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">ICU Beds</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.icu_beds || "201"}
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">License Validity</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.license_validity || "Valid Till 2027"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Departments</label>
                        <div className="relative">
                            <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500 justify-between">
                                <span className="truncate">{facility.departments || "Cardiology, Neurology, Pediatrics"}</span>
                                <span className="text-gray-400">v</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Specialities</label>
                        <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                            {facility.specialities || "Heart Surgery, Stroke Rehab"}
                        </div>
                    </div>
                </div>

                {/* Address Row */}
                <div className="mt-6 w-1/3">
                    <label className="block text-sm font-medium text-[#111827] mb-2">Address</label>
                    <div className="w-full h-12 px-4 flex items-center bg-white border border-gray-200 rounded-lg text-gray-500">
                        {facility.address || "!23 Karua Close , Westlands"}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8">
                    <button
                        onClick={() => onEdit(facility)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-[#111827] hover:bg-gray-50 font-medium"
                    >
                        Edit
                        <Edit size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewHospitalModal;
