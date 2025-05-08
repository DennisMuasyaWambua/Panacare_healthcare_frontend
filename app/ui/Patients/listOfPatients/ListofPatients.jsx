"use client";
import React, { useState, useEffect } from "react";
import { Search, MoreVertical, X, AlertCircle } from "lucide-react";
import { patientsAPI } from "../../../utils/api";
import { toast } from "react-toastify";

const ListofPatients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorIdQuery, setDoctorIdQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patients, setPatients] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalPatient, setModalPatient] = useState(null); // State for modal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await patientsAPI.getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patients");
        toast.error("Failed to load patients list");
        // Fallback to sample data
        setPatients([
          {
            id: 1,
            name: "John Doe",
            phone: "123-456-7890",
            email: "john.doe@example.com",
            package: "Gold",
            dateJoined: "2023-01-15",
            lastActive: "2023-04-01",
            lastActivity: "Logged in",
            status: "Active",
          },
          {
            id: 2,
            name: "Jane Smith",
            phone: "987-654-3210",
            email: "jane.smith@example.com",
            package: "Silver",
            dateJoined: "2023-02-10",
            lastActive: "2023-03-28",
            lastActivity: "Viewed profile",
            status: "Inactive",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDoctorIdSearch = (e) => {
    setDoctorIdQuery(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const openModal = (patient) => {
    setModalPatient(patient);
  };

  const closeModal = () => {
    setModalPatient(null);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctorId =
      doctorIdQuery === "" || patient.id.toString().includes(doctorIdQuery);
    const matchesStatus =
      statusFilter === "All" || patient.status === statusFilter;

    return matchesSearch && matchesDoctorId && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Title */}
      <h1 className="text-2xl font-bold text-[#7F375E] mb-6">List of Patients</h1>

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

        {/* Search by Doctor's ID */}
        <div>
          <label className="block text-black mb-2">Search by Doctor’s ID</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Doctor’s ID"
              value={doctorIdQuery}
              onChange={handleDoctorIdSearch}
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
        {/* Export Button */}
        <div className="p-4">
          <button className="px-4 py-2 bg-[#29AAE1] text-white rounded-lg">
            Export
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
            <p className="ml-4 text-gray-500">Loading patients...</p>
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
                <th className="px-4 py-2 text-left text-[#29AAE1]">Package</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Date Joined</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Last Active</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Last Activity</th>
                <th className="px-4 py-2 text-left text-[#29AAE1]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className={`border-t ${
                      selectedRows.includes(patient.id) ? "bg-[#29AAE140]" : ""
                    }`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        className={`w-[30px] h-[30px] rounded-lg ${
                          selectedRows.includes(patient.id)
                            ? "bg-[#29AAE1] text-white"
                            : ""
                        }`}
                        onChange={() => handleRowSelect(patient.id)}
                      />
                    </td>
                    <td
                      className="px-4 py-2 flex items-center gap-2 cursor-pointer"
                      onClick={() => openModal(patient)}
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-black">
                          {patient.name[0]}
                        </span>
                      </div>
                      <span className="text-black">{patient.name}</span>
                    </td>
                    <td className="px-4 py-2 text-black">{patient.phone}</td>
                    <td className="px-4 py-2 text-black">{patient.email}</td>
                    <td className="px-4 py-2 text-black">{patient.package}</td>
                    <td className="px-4 py-2 text-black">{patient.dateJoined}</td>
                    <td className="px-4 py-2 text-black">{patient.lastActive}</td>
                    <td className="px-4 py-2 text-black">{patient.lastActivity}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.status === "Active"
                            ? "bg-[#27A743] text-white"
                            : "bg-[#DC3544] text-white"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalPatient && (
        <div className="fixed inset-0 bg-[#000000D4] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              <X size={24} />
            </button>

            {/* Patient Name */}
            <h2 className="text-lg font-bold text-[#7F375E] mb-4">
              {modalPatient.name}
            </h2>

            {/* Patient Details */}
            <div className="bg-[#FAFAFA] p-4 rounded-lg">
              <p className="text-black mb-2">
                <strong>Phone Number:</strong> {modalPatient.phone}
              </p>
              <p className="text-black mb-2">
                <strong>Email Address:</strong> {modalPatient.email}
              </p>
              <p className="text-black mb-2">
                <strong>Package:</strong> {modalPatient.package}
              </p>
              <p className="text-black mb-2">
                <strong>Date Joined:</strong> {modalPatient.dateJoined}
              </p>
              <p className="text-black mb-2">
                <strong>Last Active:</strong> {modalPatient.lastActive}
              </p>
              <p className="text-black mb-2">
                <strong>Last Activity:</strong> {modalPatient.lastActivity}
              </p>
              <p className="text-black">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    modalPatient.status === "Active"
                      ? "bg-[#27A743] text-white"
                      : "bg-[#DC3544] text-white"
                  }`}
                >
                  {modalPatient.status}
                </span>
              </p>
            </div>

            {/* Export Button */}
            <div className="mt-4 text-right">
              <button className="px-4 py-2 bg-[#29AAE1] text-white rounded-lg">
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListofPatients;