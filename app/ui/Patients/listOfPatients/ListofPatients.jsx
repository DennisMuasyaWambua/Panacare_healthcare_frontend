"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  X,
  AlertCircle,
  FileText,
  Download,
  ChevronDown
} from "lucide-react";
import { patientsAPI } from "../../../utils/api";
import { toast } from "react-toastify";
import Pagination from "../../common/Pagination"; // Import the new component

const ListofPatients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorIdQuery, setDoctorIdQuery] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("Walk-in"); // Defaulting to Walk-in as per typical tab behavior, or could be 'All'
  const [patients, setPatients] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalPatient, setModalPatient] = useState(null); // State for modal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Row Actions State
  const [activeActionRow, setActiveActionRow] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await patientsAPI.getAllPatients();
        console.log("Patient data:", data);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDoctorIdSearch = (e) => {
    setDoctorIdQuery(e.target.value);
  };

  const handleBloodTypeFilter = (e) => {
    setBloodTypeFilter(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Modal open handled via setModalPatient where needed; inline handlers used.

  const closeModal = () => {
    setModalPatient(null);
  };

  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      const response = await patientsAPI.exportPatientsToCsv();

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patients_${new Date().toISOString().slice(0, 10)}.csv`);
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
    // Navigate to patient details page
    window.location.href = `/dashboard/patients/view/${patientId}`;
  };

  // Helper: consistent date display (e.g., 16 August 2023)
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
    } catch {
      return "N/A";
    }
  };

  // Export table to PDF (print-friendly) without new deps
  const exportToPdf = () => {
    try {
      const tableEl = document.getElementById("patients-table-wrap");
      if (!tableEl) {
        toast.error("Table not found");
        return;
      }
      const win = window.open("", "_blank");
      if (!win) {
        toast.error("Popup blocked. Allow popups to export PDF.");
        return;
      }
      const styles = `
        <style>
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px; }
          h1 { font-size: 18px; color: #7F375E; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; }
          thead th { font-size: 11px; text-transform: uppercase; color: #29AAE1; text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; }
          tbody td { font-size: 12px; color: #374151; padding: 10px; border-bottom: 1px dashed #e5e7eb; }
          .status { padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; display: inline-block; }
          .active { background: #dcfce7; color: #166534; }
          .inactive { background: #fee2e2; color: #991b1b; }
        </style>
      `;
      win.document.write(`<!doctype html><html><head><title>Patients</title>${styles}</head><body>`);
      win.document.write(`<h1>List of Patients</h1>`);
      win.document.write(tableEl.innerHTML);
      win.document.write(`</body></html>`);
      win.document.close();
      // Slight delay for rendering before print
      setTimeout(() => win.print(), 250);
    } catch (e) {
      console.error(e);
      toast.error("Failed to export PDF");
    }
  };

  const filteredPatients = (Array.isArray(patients) ? patients : []).filter((patient) => {
    // Get patient name from nested user object
    const fullName = patient.user ?
      `${patient.user.first_name} ${patient.user.last_name}`.toLowerCase() : '';

    // Check if patient email contains search query
    const email = patient.user && patient.user.email ?
      patient.user.email.toLowerCase() : '';

    // Check doctor ID if specified
    const matchesDoctorId = !doctorIdQuery ||
      (patient.doctor_id && patient.doctor_id.toString() === doctorIdQuery);

    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    // Filter by blood type
    const matchesBloodType = bloodTypeFilter === "All" ||
      patient.blood_type === bloodTypeFilter;

    // Filter by active status
    const patientStatus = patient.active ? "Active" : "Inactive";
    const matchesStatus = statusFilter === "All" || patientStatus === statusFilter;

    // Filter by Source (Mock logic - assuming backend doesn't support this yet)
    // If we had a 'source' field: const matchesSource = sourceFilter === 'All' || patient.source === sourceFilter;
    const matchesSource = true; // Placeholder: currently showing all for both tabs until backend integration

    return matchesSearch && matchesBloodType && matchesStatus && matchesDoctorId && matchesSource;

  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle click outside to close actions menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionRow && !event.target.closest('.actions-menu-container')) {
        setActiveActionRow(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeActionRow]);

  // Render content based on loading/error state
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
      <div id="patients-table-wrap" className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="w-4 h-4 rounded-md border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Patient's Name</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Phone Number</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Email Address</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Package</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Date Joined</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Last Active</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Last Activity</th>

              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Status</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-[#29AAE1] tracking-wider uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => {
              const fullName = patient.user ? `${patient.user.first_name || ""} ${patient.user.last_name || ""}`.trim() : "Full Name";
              const phone = patient.user?.phone_number || "+254 700 000000";
              const email = patient.user?.email || "Email Address";
              const pkg = patient.package?.name || patient.subscription?.package_name || "—";
              const dateJoined = formatDate(patient.user?.date_joined || patient.created_at);
              const lastActive = formatDate(patient.last_active);
              const lastActivity = patient.last_activity || "—";
              const active = Boolean(patient.active ?? patient.is_active);
              const initial = (patient.user?.first_name?.[0] || "?").toUpperCase();
              return (
                <tr key={patient.id} className="border-b border-dashed border-gray-200 hover:bg-gray-50/60">
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(patient.id)}
                      onChange={() => handleRowSelect(patient.id)}
                      className="w-4 h-4 rounded-md border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-[11px] font-semibold text-gray-700">{initial}</span>
                      </div>
                      <button onClick={() => viewPatientDetails(patient.id)} className="text-sm text-gray-800 underline-offset-2 hover:text-[#29AAE1]">
                        {fullName || "Full Name"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-sm text-gray-600">{phone}</td>
                  <td className="px-4 py-3 align-middle text-sm text-gray-600">{email}</td>
                  <td className="px-4 py-3 align-middle text-sm text-gray-600">{pkg}</td>
                  <td className="px-4 py-3 align-middle text-sm text-gray-600">{dateJoined}</td>
                  <td className="px-4 py-3 align-middle text-sm text-gray-600">{lastActive}</td>
                  <td className="px-4 py-3 align-middle text-sm text-gray-600">{lastActivity}</td>
                  <td className="px-4 py-3 align-middle">
                    <span className={`px-6 py-2 rounded-md text-[11px] font-semibold text-white ${active ? "bg-green-500" : "bg-red-500"}`}>
                      {active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle text-center relative actions-menu-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionRow(activeActionRow === patient.id ? null : patient.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeActionRow === patient.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100 py-1 text-left">
                        <button
                          onClick={() => {
                            viewPatientDetails(patient.id);
                            setActiveActionRow(null);
                          }}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            /* Add edit logic here */
                            toast.info("Edit functionality coming soon");
                            setActiveActionRow(null);
                          }}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          Edit Patient
                        </button>
                        <button
                          onClick={() => {
                            /* Add delete logic here */
                            toast.error("Cannot delete patient");
                            setActiveActionRow(null);
                          }}
                          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table >
      </div >
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Title */}
      <h1 className="text-xl font-semibold text-[#7F375E] mb-4">List of Patients</h1>

      {/* Source Selection Buttons */}
      {/* Source Selection Slider */}
      <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200 mb-6">
        <button
          onClick={() => setSourceFilter("Walk-in")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${sourceFilter === "Walk-in"
            ? "bg-[#29AAE1] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Walk In Patients
        </button>
        <button
          onClick={() => setSourceFilter("CHP")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${sourceFilter === "CHP"
            ? "bg-[#29AAE1] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Referrals from CHP
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
          {/* Search by Name */}
          <div className="lg:col-span-3">
            <label htmlFor="nameSearch" className="block text-[12px] text-gray-600 mb-1">Search by Name</label>
            <div className="relative">
              <input
                id="nameSearch"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-3 py-2 bg-[#F7FAFC] border border-gray-200 rounded-md focus:outline-none text-gray-700"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Search by Doctor's ID */}
          <div className="lg:col-span-3">
            <label htmlFor="doctorIdSearch" className="block text-[12px] text-gray-600 mb-1">Search by Doctor's ID</label>
            <div className="relative">
              <input
                id="doctorIdSearch"
                type="text"
                placeholder="Enter Doctor's ID"
                value={doctorIdQuery}
                onChange={handleDoctorIdSearch}
                className="w-full px-3 py-2 bg-[#F7FAFC] border border-gray-200 rounded-md focus:outline-none text-gray-700"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Filter by Status */}
          <div className="lg:col-span-2">
            <label htmlFor="statusFilter" className="block text-[12px] text-gray-600 mb-1">Filter by Status</label>
            <div className="relative">
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full px-3 py-2 bg-[#F7FAFC] border border-gray-200 rounded-md focus:outline-none text-gray-700 appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-4 flex justify-end gap-2">
            <button
              onClick={exportToPdf}
              className="px-3 py-2 text-sm border text-gray-600 border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
              title="Export pdf"
            >
              <FileText size={16} />
              Export PDF
            </button>
            <button
              onClick={exportToCsv}
              disabled={isExporting}
              className="px-3 py-2 text-sm border text-gray-600 border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 disabled:opacity-60"
              title="Export csv"
            >
              <Download size={16} />
              {isExporting ? 'Exporting…' : 'Export CSV'}
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/patients/add'}
              className="px-4 py-2 text-sm bg-[#29AAE1] text-white rounded-md hover:bg-[#2190ba] flex items-center gap-1"
              title="Add Patient"
            >
              Add Patient
              <span className="text-base font-semibold">+</span>
            </button>
          </div>
        </div>

        {/* More Filters dropdown (keeps previous Blood Type filter) */}
        {showMoreFilters && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="bloodTypeFilter" className="block text-[12px] text-gray-600 mb-1">Filter by Blood Type</label>
                <select
                  id="bloodTypeFilter"
                  value={bloodTypeFilter}
                  onChange={handleBloodTypeFilter}
                  className="w-full px-3 py-2 bg-[#F7FAFC] border border-gray-200 rounded-md focus:outline-none text-gray-700"
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
          </div>
        )}
      </div>

      {/* Data Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {contentToRender}


        {/* Pagination Footer */}
        {!isLoading && !error && filteredPatients.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            totalItems={filteredPatients.length}
            itemsPerPage={itemsPerPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
          />
        )}
      </div>

      {/* Patient Details Modal */}
      {modalPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#7F375E]">Patient Details</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            {/* Patient Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-semibold">{modalPatient.user ? `${modalPatient.user.first_name} ${modalPatient.user.last_name}` : 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{modalPatient.user ? modalPatient.user.email : 'No email'}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number</p>
                <p className="font-semibold">{modalPatient.user ? modalPatient.user.phone_number : 'No phone'}</p>
              </div>
              <div>
                <p className="text-gray-500">Blood Type</p>
                <p className="font-semibold">{modalPatient.blood_type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-semibold">{modalPatient.date_of_birth || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-semibold">{modalPatient.gender || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold">{modalPatient.active ? "Active" : "Inactive"}</p>
              </div>
            </div>

            {/* Actions */}
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

export default ListofPatients;
