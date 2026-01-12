"use client";
import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const ViewUserModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    // Helper to split name if needed, or use provided fields
    const firstName = user.firstName || user.username.split(' ')[0] || '';
    const secondName = user.secondName || user.username.split(' ').slice(1).join(' ') || '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden relative">
                {/* Header */}
                <div className="p-6 pb-0 flex justify-between items-center">
                    <h2 className="text-[#7F375E] text-lg font-semibold uppercase tracking-wide">
                        {user.username}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Sub-header */}
                <div className="px-6 py-2">
                    <h3 className="text-[#29AAE1] font-medium text-sm">Enter User Information</h3>
                </div>

                {/* Body */}
                <div className="p-6 pt-2">
                    <div className="border border-gray-100 rounded-lg p-6 bg-white shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">First Name:</label>
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white">
                                    {firstName}
                                </div>
                            </div>

                            {/* Second Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Second Name:</label>
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white">
                                    {secondName}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                                <div className="relative">
                                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white flex justify-between items-center">
                                        <span>{user.status}</span>
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Role:</label>
                                <div className="relative">
                                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white flex justify-between items-center">
                                        <span>{user.role}</span>
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address:</label>
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white">
                                    {user.emailAddress}
                                </div>
                            </div>

                            {/* Years of Experience */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Years of Experience</label>
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white">
                                    {user.experience?.replace(' Years', '') || '0'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 flex justify-end gap-3">
                    <button className="px-6 py-2 bg-[#E14C4C] text-white rounded-md text-sm font-medium hover:bg-[#d13b3b] transition-colors">
                        Deactivate
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                        Edit
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                        Suspend
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                        Export pdf
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                        Export csv
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewUserModal;
