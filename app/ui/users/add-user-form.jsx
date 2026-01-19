"use client";
import React, { useState } from 'react';
import { ChevronDown, FileText, Download, X } from 'lucide-react';

import { usersAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import SuccessModal from '../common/SuccessModal';

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        status: 'Active',
        role: 'Admin',
        email: '',
        phone_number: '',
        address: '',
        password: '' // Added password field
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Map frontend roles to backend role names
            let backendRole = 'patient';
            if (formData.role === 'Admin') backendRole = 'admin';
            if (formData.role === 'Doctor') backendRole = 'doctor';

            // Generate username from email or name if not provided
            const username = formData.email.split('@')[0] || formData.firstName.toLowerCase();

            // Determine is_active based on status selection
            const isActive = formData.status === 'Active';

            const payload = {
                username: username,
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.secondName,
                phone_number: formData.phone_number,
                address: formData.address,

                role_names: [backendRole], // Maps to backend 'role_names' list expectation
                role: backendRole,
                is_active: isActive
            };

            await usersAPI.register(payload);

            setShowSuccessModal(true);
            setFormData({
                firstName: '',
                secondName: '',
                status: 'Active',
                role: 'Admin',
                email: '',
                phone_number: '',
                address: '',
                password: ''
            });

        } catch (error) {
            console.error("Error creating user:", error);

            let errorMessage = error.message || "Failed to create user";

            // Parse backend field-specific errors
            if (error.response && typeof error.response === 'object') {
                const fieldErrors = [];
                Object.entries(error.response).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        fieldErrors.push(`${key}: ${value.join(', ')}`);
                    } else if (typeof value === 'string') {
                        fieldErrors.push(`${key}: ${value}`);
                    }
                });

                if (fieldErrors.length > 0) {
                    errorMessage = fieldErrors.join('\n');
                }
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                placeholder="Enter Your First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                            />
                        </div>

                        {/* Second Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Second Name:</label>
                            <input
                                type="text"
                                name="secondName"
                                required
                                placeholder="Enter Your Second Name"
                                value={formData.secondName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                            />
                        </div>

                        {/* Status - Visual only for creation */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1] bg-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Role:</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1] bg-white"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                    <option value="Doctor">Doctor</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address:</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Enter Your Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number:</label>
                            <input
                                type="tel"
                                name="phone_number"
                                required
                                placeholder="Enter Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Address:</label>
                            <input
                                type="text"
                                name="address"
                                required
                                placeholder="Enter Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                            />
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <span className="font-bold">Export pdf</span>
                        </button>
                        <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <span className="font-bold">Export csv</span>
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-12 py-3 bg-[#29AAE1] text-white rounded-full font-medium hover:bg-[#2399c9] transition-colors min-w-[200px] disabled:opacity-70"
                    >
                        {isSubmitting ? "Creating..." : "Submit"}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative flex flex-col items-center">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            onClick={closeModal}
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-6 relative">
                            <div className="w-16 h-16 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"></div>
                                    <div className="w-2 h-2 bg-red-400 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4"></div>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full absolute left-0 top-1/2 transform -translate-x-4 -translate-y-1/2"></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full absolute right-0 top-1/2 transform translate-x-4 -translate-y-1/2"></div>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full absolute top-1/4 left-1/4"></div>
                                    <div className="w-1 h-1 bg-red-500 rounded-full absolute bottom-1/4 right-1/4"></div>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-lg font-normal text-gray-600 mb-6">User created successfully</h2>

                        <button
                            onClick={closeModal}
                            className="px-12 py-2 bg-[#29AAE1] text-white rounded-full hover:bg-blue-600 font-medium"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddUserForm;
