"use client";
import React, { useState, useEffect } from "react";
import { Search, MoreVertical, AlertCircle } from "lucide-react";
import { DoctorDetailsPopup } from "../viewDoctor/DoctorDetailsPopup";
import { doctorsAPI } from "../../../utils/api";
import { toast } from "react-toastify";

const ListOfDoctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("pana_access_token");
        if (!token) {
          throw new Error("No access token found");
        }
        const response = await fetch("https://panacaredjangobackend-production.up.railway.app/api/doctors/admin_list_doctors/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `Error ${response.status}`);
        }
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors");
        toast.error("Failed to load doctors list");
        // Fallback sample data if needed.
        setDoctors([
          {
            id: 1,
            name: "Dr. John Doe",
            phone: "123-456-7890",
            email: "john.doe@example.com",
            specialty: "Cardiology",
            dateJoined: "2023-01-15",
            lastActive: "2023-04-01",
            status: "Active",
          },
          {
            id: 2,
            name: "Dr. Jane Smith",
            phone: "987-654-3210",
            email: "jane.smith@example.com",
            specialty: "Pediatrics",
            dateJoined: "2023-02-10",
            lastActive: "2023-03-28",
            status: "Inactive",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter((doctor) => {
    // Build full name from the nested user object
    const fullName = `${doctor.user.first_name} ${doctor.user.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    
    // Determine doctor status based on is_verified property
    const doctorStatus = doctor.is_verified ? "Active" : "Inactive";
    const matchesStatus =
      statusFilter === "All" || doctorStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleNavigate = () => {
    window.location.href = "/dashboard/doctors/add";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold text-[#7F375E] mb-6">List of Doctors</h1>

      {/* Search and Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search by Name */}
        <div>
          <label className="block text-black mb-2">Search by Name</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Filter by Status */}
        <div>
          <label className="block text-black mb-2">Filter by Status</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* More Filters */}
        <div>
          <label className="block text-black mb-2">More Filters</label>
          <div className="flex items-center justify-center h-full">
            <MoreVertical className="text-black" size={24} />
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Add Doctor Button */}
        <div className="p-4 flex justify-between items-center">
          <button className="px-4 py-2 bg-[#29AAE1] text-white rounded-lg" onClick={handleNavigate}>
            Add Doctor
          </button>
          <button className="px-4 py-2 bg-[#29AAE1] text-white rounded-lg">
            Export
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
            <p className="ml-4 text-gray-500">Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-8 text-red-500">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-[#29AAE1]">
                  <input
                    type="checkbox"
                    className="w-[30px] h-[30px] rounded-lg border-gray-300"
                  />
                </th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Name</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Phone</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Email</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Specialty</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Date Joined</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Last Active</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No doctors found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className={`border-t ${
                      selectedRows.includes(doctor.id) ? "bg-[#29AAE140]" : ""
                    }`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        className={`w-[30px] h-[30px] rounded-lg ${
                          selectedRows.includes(doctor.id)
                            ? "bg-[#29AAE1] text-white"
                            : ""
                        }`}
                        onChange={() => handleRowSelect(doctor.id)}
                      />
                    </td>
                    {/* Trigger popup on name click */}
                    <td
                      className="px-4 py-2 text-black cursor-pointer"
                      onClick={() => {
                        // Always set token before showing popup
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('access_token', 'doctor_view_token');
                          // Mark that we're viewing a doctor
                          sessionStorage.setItem('viewing_doctor', 'true');
                        }
                        setSelectedDoctor(doctor);
                      }}
                    >
                      {doctor.user.last_name}
                    </td>
                    <td className="px-4 py-2 text-black">{doctor.user.phone_number}</td>
                    <td className="px-4 py-2 text-black">{doctor.user.email}</td>
                    <td className="px-4 py-2 text-black">{doctor.specialty}</td>
                    <td className="px-4 py-2 text-black">{doctor.created_at}</td>
                    <td className="px-4 py-2 text-black">{doctor.lastActive}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doctor.is_available === "true"
                            ? "bg-[#27A743] text-white"
                            : "bg-[#DC3544] text-white"
                        }`}
                      >
                        {doctor.is_available}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Conditionally render the */}
      {selectedDoctor && (
        <DoctorDetailsPopup
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default ListOfDoctors;