"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddHospitalModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: "",
        registration_number: "",
        established_year: "2010",
        phone: "",
        email: "",
        total_beds: "2010",
        icu_beds: "201",
        license_validity: "Valid Till 2027",
        departments: "Cardiology, Neurology, Pediatrics",
        specialities: "Heart Surgery, Stroke Rehab",
        address: "",
        category: "GENERAL", // Default category
        city: "Nairobi",
        country: "Kenya"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                registration_number: initialData.registration_number || "",
                established_year: initialData.established_year || "2010",
                phone: initialData.phone || initialData.phone_number || "",
                email: initialData.email || "",
                total_beds: initialData.total_beds || "2010",
                icu_beds: initialData.icu_beds || "201",
                license_validity: initialData.license_validity || "Valid Till 2027",
                departments: initialData.departments || "Cardiology, Neurology, Pediatrics",
                specialities: initialData.specialities || "Heart Surgery, Stroke Rehab",
                address: initialData.address || "",
                category: initialData.category || "GENERAL",
                city: initialData.city || "Nairobi",
                country: initialData.country || "Kenya"
            });
        } else {
            setFormData({
                name: "",
                registration_number: "",
                established_year: "2010",
                phone: "",
                email: "",
                total_beds: "2010",
                icu_beds: "201",
                license_validity: "Valid Till 2027",
                departments: "Cardiology, Neurology, Pediatrics",
                specialities: "Heart Surgery, Stroke Rehab",
                address: "",
                category: "GENERAL",
                city: "Nairobi",
                country: "Kenya"
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct the description from extra fields to preserve data
        const description = `
Registration: ${formData.registration_number}
Established: ${formData.established_year}
Total Beds: ${formData.total_beds}
ICU Beds: ${formData.icu_beds}
License Validity: ${formData.license_validity}
Departments: ${formData.departments}
Specialities: ${formData.specialities}
        `.trim();

        // Construct payload matching backend HealthcareFacility model
        const payload = {
            name: formData.name,
            description: description,
            category: formData.category,
            address: formData.address,
            phone_number: formData.phone, // Map phone to phone_number
            email: formData.email,
            city: formData.city,
            country: formData.country,
            is_active: true,
            is_verified: false
        };

        // If editing, we might want to pass more fields or handle it differently
        // but for now we follow the backend structure.
        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 rounded-full border border-black hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-black" />
                </button>

                <h2 className="text-2xl font-bold text-[#111827] mb-8">
                    {initialData ? "Edit Hospital" : "Add New Hospital"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Hospital Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#111827] mb-2">Hospital Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Hospital Name"
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                        {/* Row 1 */}
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E] appearance-none"
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="PEDIATRIC">Pediatric</option>
                                    <option value="MENTAL">Mental Health</option>
                                    <option value="DENTAL">Dental</option>
                                    <option value="VISION">Vision</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Registration Number</label>
                            <input
                                type="text"
                                name="registration_number"
                                value={formData.registration_number}
                                onChange={handleChange}
                                placeholder="Enter Registration Number"
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Established in</label>
                            <input
                                type="text"
                                name="established_year"
                                value={formData.established_year}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>

                        {/* Row 2 */}
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter Number"
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="johndoe@example.com"
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Total Beds</label>
                            <input
                                type="text"
                                name="total_beds"
                                value={formData.total_beds}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>

                        {/* Row 3 */}
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">ICU Beds</label>
                            <input
                                type="text"
                                name="icu_beds"
                                value={formData.icu_beds}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">License Validity</label>
                            <input
                                type="text"
                                name="license_validity"
                                value={formData.license_validity}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Departments</label>
                            <input
                                type="text"
                                name="departments"
                                value={formData.departments}
                                onChange={handleChange}
                                placeholder="Comma separated"
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Specialities</label>
                            <input
                                type="text"
                                name="specialities"
                                value={formData.specialities}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                            />
                        </div>
                    </div>

                    {/* Address Row */}
                    <div className="mt-6 w-full md:w-2/3">
                        <label className="block text-sm font-medium text-[#111827] mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="!23 Karua Close , Westlands"
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-[#111827] focus:outline-none focus:border-[#7F375E]"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#8B3D5A] text-white rounded-lg hover:bg-[#723249] font-medium transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHospitalModal;
