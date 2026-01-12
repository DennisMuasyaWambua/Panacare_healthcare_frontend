"use client";
import React, { useState } from "react";
import { Calendar, ChevronDown, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { patientsAPI } from "../../../utils/api";
import { toast } from "react-toastify";

export default function AddPatientPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Details
        registrationNumber: "PT" + Math.floor(1000000000 + Math.random() * 9000000000), // Auto-gen for display
        dob: "",
        salutation: "Mr.",
        fullName: "",
        gender: "Female/She/Her",
        bloodGroup: "B+",
        phone: "",
        email: "",
        address: "",
        // Medical Info
        primaryDoctor: "",
        allergies: "",
        conditions: "",
        medications: "",
        surgeries: "",
        // Insurance & Emergency
        insuranceProvider: "",
        policyNumber: "",
        contactName: "",
        contactRelation: "",
        contactNumber: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // basic validation
            if (!formData.fullName || !formData.email || !formData.phone) {
                toast.error("Please fill in required fields (Name, Email, Phone)");
                setIsLoading(false);
                return;
            }

            const nameParts = formData.fullName.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Construct payload
            // Using admin_add_patient endpoint structure (similar to AddDoctor)
            const username = formData.email.split('@')[0] || firstName.toLowerCase();
            const password = "Password123!"; // Default password for admin-created users

            const payload = {
                // User fields (Strictly User model only)
                username: username,
                email: formData.email,
                password: password,
                first_name: firstName,
                last_name: lastName,
                phone_number: formData.phone,
                role: "patient",
                is_active: true // Correct field name for User model
            };

            console.log("Submitting payload:", payload);
            await patientsAPI.addPatient(payload);

            toast.success("Patient added successfully!");
            router.push('/dashboard/patients');

        } catch (error) {
            console.error("Error adding patient:", error);
            let errorMessage = "Failed to add patient";

            if (error.response) {
                // Handle Django/DRF error formats
                if (typeof error.response === 'string') {
                    errorMessage = error.response;
                } else if (error.response.detail) {
                    errorMessage = error.response.detail;
                } else if (error.response.error) {
                    errorMessage = typeof error.response.error === 'object'
                        ? JSON.stringify(error.response.error)
                        : error.response.error;
                } else {
                    // Start checking for field-specific errors
                    const keys = Object.keys(error.response);
                    if (keys.length > 0) {
                        // Just show the first error found for simplicity, or join them
                        const firstKey = keys[0];
                        const firstError = error.response[firstKey];
                        errorMessage = `${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`;
                    }
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#A61C4C]">Patient Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    {/* Placeholder for header actions if any */}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
                {/* Personal Details Section */}
                <div className="mb-10">
                    <h2 className="text-[#A61C4C] text-lg font-bold mb-6">
                        Personal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Registration Number */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Registration Number:
                            </label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                readOnly
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-sm focus:outline-none"
                            />
                        </div>

                        {/* Date Of Birth */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Date Of Birth:
                            </label>
                            <div className="relative">
                                <input
                                    type="text" // using text for now to match design placeholder "04/23/1996", ideally date type
                                    name="dob"
                                    placeholder="YYYY-MM-DD"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Salutation & Full Name */}
                        <div className="col-span-1 flex gap-4">
                            <div className="w-1/4">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Salutation:
                                </label>
                                <div className="relative">
                                    <select
                                        name="salutation"
                                        value={formData.salutation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 appearance-none bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                    >
                                        <option>Mr.</option>
                                        <option>Ms.</option>
                                        <option>Mrs.</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="w-3/4">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Full Name:
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                            </div>
                        </div>

                        {/* Gender & Blood Group */}
                        <div className="col-span-1 flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Gender:
                                </label>
                                <div className="relative">
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 appearance-none bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                    >
                                        <option>Female/She/Her</option>
                                        <option>Male/He/Him</option>
                                        <option>Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Blood Group:
                                </label>
                                <div className="relative">
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 appearance-none bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                    >
                                        <option>B+</option>
                                        <option>A+</option>
                                        <option>O+</option>
                                        <option>AB+</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Phone Number:
                            </label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="+01 123 445 67890"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                            />
                        </div>

                        {/* Email Address */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Email Address:
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="doe.john@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                            />
                        </div>

                        {/* Address */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Address:
                            </label>
                            <input
                                type="text"
                                name="address"
                                placeholder="123 Park Avenue, NY, USA"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C] resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Medical Information Section */}
                <div className="mb-10">
                    <h2 className="text-gray-900 text-lg font-bold mb-6">
                        Medical Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Primary Doctor */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Primary Doctor:
                            </label>
                            <input
                                type="text"
                                name="primaryDoctor"
                                placeholder="Dr. Jane Doe"
                                value={formData.primaryDoctor}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                            />
                        </div>

                        {/* Known Allergies */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Known Allergies:
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="allergies"
                                    placeholder="Penicillin, Eczema"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                                <Edit2 className="absolute right-3 top-2.5 h-4 w-4 text-gray-900" />
                            </div>
                        </div>

                        {/* Chronic Conditions */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Chronic Conditions:
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="conditions"
                                    placeholder="Penicillin, Eczema"
                                    value={formData.conditions}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                                <Edit2 className="absolute right-3 top-2.5 h-4 w-4 text-gray-900" />
                            </div>
                        </div>

                        {/* Current Medications */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Current Medications:
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="medications"
                                    placeholder="Penicillin, Eczema"
                                    value={formData.medications}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                                <Edit2 className="absolute right-3 top-2.5 h-4 w-4 text-gray-900" />
                            </div>
                        </div>

                        {/* Past Surgeries */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Past Surgeries:
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="surgeries"
                                    placeholder="Penicillin, Eczema"
                                    value={formData.surgeries}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                                <Edit2 className="absolute right-3 top-2.5 h-4 w-4 text-gray-900" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insurance & Emergency Contact Section */}
                <div className="mb-4">
                    <h2 className="text-gray-900 text-lg font-bold mb-6">
                        Insurance & Emergency Contact
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Insurance Provider */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Insurance Provider:
                            </label>
                            <input
                                type="text"
                                name="insuranceProvider"
                                placeholder="MediCover Health"
                                value={formData.insuranceProvider}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                            />
                        </div>

                        {/* Policy Number */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Policy Number:
                            </label>
                            <input
                                type="text"
                                name="policyNumber"
                                placeholder="MC-1122-98075"
                                value={formData.policyNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                            />
                        </div>

                        {/* Contact Name */}
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Contact Name:
                            </label>
                            <input
                                type="text"
                                name="contactName"
                                placeholder="Daniel Doe"
                                value={formData.contactName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                            />
                        </div>

                        {/* Contact Relation and Number */}
                        <div className="col-span-1 flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Contact Relation:
                                </label>
                                <input
                                    type="text"
                                    name="contactRelation"
                                    placeholder="Brother"
                                    value={formData.contactRelation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Contact Number:
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    placeholder="+01 000 00000"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61C4C]"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-10 flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#8B3A4F] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#722f41] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Submitting..." : "Submit Patient Details"}
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/patients')}
                        className="bg-white border border-gray-200 text-gray-700 px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
