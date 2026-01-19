"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const AddAppointmentDropdown = ({ isOpen, onClose, onSubmit }) => {
    const dropdownRef = useRef(null);
    const [formData, setFormData] = useState({
        patient_name: "",
        subscription: "Msingi",
        status: "Upcoming",
        type: "Video",
        doctor_name: "Msingi",
        start_time: "10:00 Am",
        end_time: "12:00 Pm"
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
            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 w-[500px] p-6 z-50 max-h-[80vh] overflow-y-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-[#111827]">Add Appointment</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <X size={18} className="text-gray-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Name</label>
                    <input
                        type="text"
                        name="patient_name"
                        value={formData.patient_name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E]"
                        required
                    />
                </div>

                {/* Subscription */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Subscription</label>
                    <div className="relative">
                        <select
                            name="subscription"
                            value={formData.subscription}
                            onChange={handleChange}
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none"
                        >
                            <option value="Msingi">Msingi</option>
                            <option value="Premium">Premium</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Status</label>
                    <div className="relative">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none"
                        >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Booking">Booking</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Type */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Type</label>
                    <div className="relative">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none"
                        >
                            <option value="Video">Video</option>
                            <option value="Chat">Chat</option>
                            <option value="In-Person">In-Person</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Assign to Doctor */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Assign to Doctor</label>
                    <div className="relative">
                        <select
                            name="doctor_name"
                            value={formData.doctor_name}
                            onChange={handleChange}
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none"
                        >
                            <option value="Msingi">Msingi</option>
                            <option value="Dr. Smith">Dr. Smith</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Start Time */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Start Time</label>
                    <div className="relative">
                        <select
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none"
                        >
                            <option value="10:00 Am">10:00 Am</option>
                            <option value="11:00 Am">11:00 Am</option>
                            <option value="12:00 Pm">12:00 Pm</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* End Time */}
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">End Time</label>
                    <input
                        type="text"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#7F375E]"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full h-10 bg-[#8B3D5A] text-white rounded-lg hover:bg-[#723249] font-medium transition-colors text-sm"
                    >
                        Submit
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddAppointmentDropdown;
