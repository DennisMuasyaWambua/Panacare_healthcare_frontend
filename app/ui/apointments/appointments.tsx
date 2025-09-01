"use client";
import React, { useState, useEffect } from "react";
import { Search, X, AlertCircle, Download, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import CustomTable from "../../components/CustomTable";
import { appointmentsAPI } from "../../utils/api";

const DropdownMenu = ({ position, onAction }) => {
  return createPortal(
    <div
      className="absolute bg-white border border-purple-400 rounded shadow z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        minWidth: "120px",
        borderStyle: "dashed",
      }}
    >
      {["View", "Approve", "Reject"].map((action, i) => (
        <button
          key={i}
          onClick={() => onAction(action)}
          className="block w-full text-left px-3 py-2 hover:bg-purple-50"
          style={{
            borderBottom: i < 2 ? "1px dashed #A855F7" : "none",
            color: "#4B0082",
          }}
        >
          {action}
        </button>
      ))}
    </div>,
    document.body
  );
};

interface PaginationResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  results: T[];
}

const AllAppointments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modalAppointment, setModalAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data: PaginationResponse<any> =
        await appointmentsAPI.getAllAppointmentsenhanced({
          page,
          page_size: pageSize,
        });
      setAppointments(data.results || []);
    } catch (error) {
      setError("Failed to load appointments list");
      toast.error("Failed to load appointments list");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, pageSize]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) setOpenDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown]);

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const handleApprove = async (appointment) => {
    try {
      await appointmentsAPI.updateAppointmentStatus(appointment.id, "confirmed");
      toast.success("Appointment approved successfully");
      fetchAppointments();
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve appointment");
    }
  };

  const handleReject = async (appointment) => {
    try {
      await appointmentsAPI.updateAppointmentStatus(appointment.id, "rejected");
      toast.success("Appointment rejected successfully");
      fetchAppointments();
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Failed to reject appointment");
    }
  };

  const handleDropdownAction = (action, row) => {
    if (action === "View") {
      setModalAppointment(row);
    } else if (action === "Approve") {
      handleApprove(row);
    } else if (action === "Reject") {
      handleReject(row);
    }
    setOpenDropdown(null);
  };

  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      const response = await appointmentsAPI.exportAppointmentsToCsv();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `appointments_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Appointments data exported successfully");
    } catch (error) {
      console.error("Error exporting appointments:", error);
      toast.error("Failed to export appointments");
    } finally {
      setIsExporting(false);
    }
  };

  // Filtering
  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      name: "Patient",
      selector: (row) => row.patient_name,
      sortable: true,
    },
    {
      name: "Doctor",
      selector: (row) => row.doctor_name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.appointment_date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => `${row.start_time} - ${row.end_time}`,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.appointment_type,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${row.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : row.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"}`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setOpenDropdown({
              id: row.id,
              row,
              position: {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
              },
            });
          }}
          className="p-1"
        >
          <MoreVertical size={18} />
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  let contentToRender;
  if (isLoading) {
    contentToRender = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading appointments...</p>
      </div>
    );
  } else if (error) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );
  } else if (filteredAppointments.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No appointments found matching your filters
      </div>
    );
  } else {
    contentToRender = (
      <CustomTable
        columns={columns}
        data={filteredAppointments}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-2xl font-bold text-[#7F375E] mb-6">List of Appointments</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-black mb-2">
            Search by Patient/Doctor
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Enter name..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-black mb-2">
            Filter by Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
          >
            <option value="All">All</option>
            <option value="booked">Booked</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-end gap-2 h-full md:justify-end justify-center">
          <button
            onClick={exportToCsv}
            className="flex items-center justify-center px-4 py-2 bg-[#29AAE1] text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            disabled={isExporting}
            type="button"
          >
            <Download className="mr-2" size={18} />
            {isExporting ? "Exporting..." : "Export csv"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {contentToRender}
      </div>

      {openDropdown && (
        <DropdownMenu
          position={openDropdown.position}
          onAction={(action) => handleDropdownAction(action, openDropdown.row)}
        />
      )}

      {modalAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#7F375E]">
                Appointment Details
              </h2>
              <button
                onClick={() => setModalAppointment(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Patient</p>
                <p className="font-semibold">{modalAppointment.patient_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Doctor</p>
                <p className="font-semibold">{modalAppointment.doctor_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">{modalAppointment.appointment_date}</p>
              </div>
              <div>
                <p className="text-gray-500">Time</p>
                <p className="font-semibold">
                  {modalAppointment.start_time} - {modalAppointment.end_time}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-semibold">{modalAppointment.appointment_type}</p>
              </div>
              <div>
                <p className="text-gray-500">Reason</p>
                <p className="font-semibold">{modalAppointment.reason || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Facility</p>
                <p className="font-semibold">
                  {modalAppointment.healthcare_facility_name}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold">{modalAppointment.status}</p>
              </div>
              <div>
                <p className="text-gray-500">Diagnosis</p>
                <p className="font-semibold">{modalAppointment.diagnosis || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Treatment</p>
                <p className="font-semibold">{modalAppointment.treatment || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Notes</p>
                <p className="font-semibold">{modalAppointment.notes || "None"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
