"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Edit2 } from "lucide-react";

const AddUserDropdown = ({ isOpen, onClose, onSubmit }) => {
    const dropdownRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        status: "Active",
        email: "",
        password: "", // Added password field
        role: "patient", // Default to lowercase patient
        experience: "0 Years"
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-12 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 w-[400px] p-6 z-50 max-h-[85vh] overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111827]">User Details</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full border border-black hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-black" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter First Name"
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E]"
                    />
                </div>

                {/* Second Name */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Enter Second Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter Second Name"
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E]"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Status</label>
                    <div className="relative">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#6B7280] focus:outline-none focus:border-[#7F375E] appearance-none"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email Address"
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E]"
                    />
                </div>

                {/* Password - Added field */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E]"
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Role</label>
                    <div className="relative">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#6B7280] focus:outline-none focus:border-[#7F375E] appearance-none"
                        >
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="patient">Patient</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>


                {/* Years of Experience */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Years of Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="10 Years"
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E]"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 h-10 bg-[#8B3D5A] text-white rounded-lg hover:bg-[#723249] font-medium transition-colors text-sm"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="flex-1 h-10 bg-white border border-gray-200 text-[#111827] rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        Edit <Edit2 size={14} />
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddUserDropdown;
