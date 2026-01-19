"use client";
import React, { useState, useEffect } from "react";
import { X, Edit2 } from "lucide-react";

const ViewAppointmentModal = ({ appointment, onClose, onEdit, onSubmit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        patient_name: "",
        subscription: "Msingi",
        status: "Upcoming",
        type: "Video",
        doctor_name: "Msingi", // Using mock value from screenshot
        start_time: "10:00 Am",
        end_time: "12:00 Pm"
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                patient_name: appointment.patient_name || "",
                subscription: appointment.subscription || "Msingi",
                status: appointment.status || "Upcoming",
                type: appointment.appointment_type || "Video",
                doctor_name: appointment.doctor_name || "Msingi",
                start_time: appointment.start_time || "10:00 Am",
                end_time: appointment.end_time || "12:00 Pm"
            });
        }
    }, [appointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Logic to submit updates
        if (onSubmit) {
            onSubmit({ ...appointment, ...formData });
        }
        onClose();
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 rounded-full border border-black hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-black" />
                </button>

                <h2 className="text-2xl font-bold text-[#111827] mb-8">Appointment Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                    {/* Row 1 */}
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Name</label>
                        <input
                            type="text"
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] disabled:bg-gray-50"
                            placeholder="Enter name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Subscription</label>
                        <div className="relative">
                            <select
                                name="subscription"
                                value={formData.subscription}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none disabled:bg-gray-50"
                            >
                                <option value="Msingi">Msingi</option>
                                <option value="Premium">Premium</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Status</label>
                        <div className="relative">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none disabled:bg-gray-50"
                            >
                                <option value="Upcoming">Upcoming</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Type</label>
                        <div className="relative">
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none disabled:bg-gray-50"
                            >
                                <option value="Video">Video</option>
                                <option value="Chat">Chat</option>
                                <option value="In-Person">In-Person</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Assign to Doctor</label>
                        <div className="relative">
                            <select
                                name="doctor_name"
                                value={formData.doctor_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none disabled:bg-gray-50"
                            >
                                <option value="Msingi">Msingi</option>
                                <option value="Dr. Smith">Dr. Smith</option>
                                <option value="Dr. Doe">Dr. Doe</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">Start Time</label>
                        <div className="relative">
                            <select
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none disabled:bg-gray-50"
                            >
                                <option value="10:00 Am">10:00 Am</option>
                                <option value="11:00 Am">11:00 Am</option>
                                <option value="12:00 Pm">12:00 Pm</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3 - End Time */}
                <div className="mt-6 w-1/3 pr-4">
                    <label className="block text-sm font-medium text-[#111827] mb-2">End Time</label>
                    <input
                        type="text"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] disabled:bg-gray-50"
                    />
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex items-center gap-4">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-[#111827] hover:bg-gray-50 font-medium"
                    >
                        Edit
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 bg-[#8B3D5A] text-white rounded-lg hover:bg-[#723249] font-medium transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewAppointmentModal;
