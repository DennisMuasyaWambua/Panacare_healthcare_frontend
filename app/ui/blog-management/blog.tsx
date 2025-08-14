
"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";
import { patientsAPI } from "../../utils/api";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable"; // Adjust the import path as necessary
const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorIdQuery, setDoctorIdQuery] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patients, setPatients] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalPatient, setModalPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await patientsAPI.getAllPatients();
        setPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patients");
        toast.error("Failed to load patients list");
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleDoctorIdSearch = (e) => setDoctorIdQuery(e.target.value);
  const handleBloodTypeFilter = (e) => setBloodTypeFilter(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const openModal = (patient) => setModalPatient(patient);
  const closeModal = () => setModalPatient(null);

  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      const response = await patientsAPI.exportPatientsToCsv();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `patients_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Patients data exported successfully");
    } catch (error) {
      console.error("Error exporting patients data:", error);
      toast.error("Failed to export patients data");
    } finally {
      setIsExporting(false);
    }
  };

  const viewPatientDetails = (patientId) => {
    window.location.href = `/dashboard/patients/view/${patientId}`;
  };

  const filteredPatients = (Array.isArray(patients) ? patients : []).filter(
    (patient) => {
      const fullName = patient.user
        ? `${patient.user.first_name} ${patient.user.last_name}`.toLowerCase()
        : "";
      const email =
        patient.user && patient.user.email
          ? patient.user.email.toLowerCase()
          : "";
      const matchesDoctorId =
        !doctorIdQuery ||
        (patient.doctor_id &&
          patient.doctor_id.toString() === doctorIdQuery);
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase());
      const matchesBloodType =
        bloodTypeFilter === "All" ||
        patient.blood_type === bloodTypeFilter;
      const patientStatus = patient.active ? "Active" : "Inactive";
      const matchesStatus =
        statusFilter === "All" || patientStatus === statusFilter;

      return (
        matchesSearch &&
        matchesBloodType &&
        matchesStatus &&
        matchesDoctorId
      );
    }
  );

  const columns = [
    {
      name: "",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
          className="w-4 h-4 rounded-lg border-gray-300"
        />
      ),
      width: "60px",
      ignoreRowClick: true,
      allowoverflow: true,
      button: true,
    },
    {
      name: "Article Title",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-black">
              {row.user && row.user.first_name
                ? row.user.first_name[0]
                : "?"}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.user
                ? `${row.user.first_name} ${row.user.last_name}`
                : "Unknown"}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Author",
      cell: (row) => (
        <div>
          <div className="text-sm text-gray-500">
            {row.user ? row.user.email : "No email"}
          </div>
          <div className="text-sm text-gray-500">
            {row.user ? row.user.phone_number : "No phone"}
          </div>
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.date_of_birth || "Not specified",
      sortable: true,
    },
    
    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.date_of_birth || "Not specified",
      sortable: true,
    },
    {
      name: "Access",
      selector: (row) => row.date_of_birth || "Not specified",
      sortable: true,
    },
    {
      name: "Access",
      selector: (row) => row.date_of_birth || "Not specified",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => viewPatientDetails(row.id)}
          className="text-[#29AAE1] hover:text-blue-700"
        >
          <Eye size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: true,
    },
  ];

 


  let contentToRender;
  if (isLoading) {
    contentToRender = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading patients...</p>
      </div>
    );
  } else if (error) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  } else if (filteredPatients.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No patients found matching your filters
      </div>
    );
  } else {
    contentToRender = (
      <CustomTable
  columns={columns}
  data={filteredPatients}
  isLoading={isLoading}
  error={error}
/>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#7F375E]">
          Blog Management
        </h1>
        <button
          onClick={exportToCsv}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#29AAE1] text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          <Download size={18} />
          {isExporting ? "Exporting..." : "Export to CSV"}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="nameSearch" className="block text-black mb-2">
            Search by Name or Email
          </label>
          <div className="relative">
            <input
              id="nameSearch"
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            />
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div>
          <label htmlFor="doctorIdSearch" className="block text-black mb-2">
            Search by Doctor's ID
          </label>
          <div className="relative">
            <input
              id="doctorIdSearch"
              type="text"
              placeholder="Enter Doctor's ID"
              value={doctorIdQuery}
              onChange={handleDoctorIdSearch}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            />
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bloodTypeFilter" className="block text-black mb-2">
            Filter by Blood Type
          </label>
          <div className="relative">
            <select
              id="bloodTypeFilter"
              value={bloodTypeFilter}
              onChange={handleBloodTypeFilter}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="All">All Blood Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="statusFilter" className="block text-black mb-2">
            Filter by Status
          </label>
          <div className="relative">
            <select
              id="statusFilter"
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
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {contentToRender}
      </div>

      {modalPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#7F375E]">
                Patient Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-semibold">
                  {modalPatient.user
                    ? `${modalPatient.user.first_name} ${modalPatient.user.last_name}`
                    : "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">
                  {modalPatient.user
                    ? modalPatient.user.email
                    : "No email"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number</p>
                <p className="font-semibold">
                  {modalPatient.user
                    ? modalPatient.user.phone_number
                    : "No phone"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Blood Type</p>
                <p className="font-semibold">
                  {modalPatient.blood_type || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-semibold">
                  {modalPatient.date_of_birth || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-semibold">
                  {modalPatient.gender || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold">
                  {modalPatient.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={() => viewPatientDetails(modalPatient.id)}
                className="px-4 py-2 bg-[#29AAE1] text-white rounded"
              >
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
