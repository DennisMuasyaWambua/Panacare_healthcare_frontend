"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const AddSubscription = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_days: 30,
    consultation_limit: 5,
    priority_support: false,
    access_to_resources: true,
    video_consultation: false,
    is_active: true
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              type === "number" ? (value === "" ? "" : Number(value)) : 
              value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    if (!formData.duration_days || formData.duration_days <= 0) {
      newErrors.duration_days = "Valid duration is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Construct the features object
      const features = {
        priority_support: formData.priority_support,
        access_to_articles: formData.access_to_resources,
        video_consultation: formData.video_consultation
      };
      
      // Create the final payload
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.duration_days, 10),
        consultation_limit: parseInt(formData.consultation_limit, 10),
        is_active: formData.is_active,
        features // Backend might ignore this if it's not in their schema
      };
      
      onSubmit(payload);
    }
  };

  return (
    <>
      {/* Modal overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Add New Subscription Package</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Package Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:ring-[#29AAE1] focus:border-[#29AAE1]`}
                  placeholder="Enter package name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:ring-[#29AAE1] focus:border-[#29AAE1]`}
                  placeholder="Enter package description"
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (KES) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:ring-[#29AAE1] focus:border-[#29AAE1]`}
                  placeholder="0.00"
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  min="1"
                  className={`w-full p-2 border ${errors.duration_days ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:ring-[#29AAE1] focus:border-[#29AAE1]`}
                />
                {errors.duration_days && <p className="mt-1 text-sm text-red-500">{errors.duration_days}</p>}
              </div>
              
              {/* Consultation Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Limit
                </label>
                <input
                  type="number"
                  name="consultation_limit"
                  value={formData.consultation_limit}
                  onChange={handleChange}
                  min="-1"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                />
                <p className="mt-1 text-xs text-gray-500">Use -1 for unlimited consultations</p>
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="is_active"
                  value={formData.is_active}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#29AAE1] focus:border-[#29AAE1]"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              
              {/* Features section */}
              <div className="col-span-2">
                <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="priority_support"
                      name="priority_support"
                      checked={formData.priority_support}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#29AAE1] focus:ring-[#29AAE1] border-gray-300 rounded"
                    />
                    <label htmlFor="priority_support" className="ml-2 block text-sm text-gray-700">
                      Priority Support
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="access_to_resources"
                      name="access_to_resources"
                      checked={formData.access_to_resources}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#29AAE1] focus:ring-[#29AAE1] border-gray-300 rounded"
                    />
                    <label htmlFor="access_to_resources" className="ml-2 block text-sm text-gray-700">
                      Access to Resources
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="video_consultation"
                      name="video_consultation"
                      checked={formData.video_consultation}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#29AAE1] focus:ring-[#29AAE1] border-gray-300 rounded"
                    />
                    <label htmlFor="video_consultation" className="ml-2 block text-sm text-gray-700">
                      Video Consultation
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#29AAE1] text-white rounded-md hover:bg-[#1c8bbf]"
              >
                Add Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

AddSubscription.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddSubscription;
