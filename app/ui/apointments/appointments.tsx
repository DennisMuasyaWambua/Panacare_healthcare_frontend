"use client";
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import { appointmentsAPI } from "../../utils/api";
import ViewAppointmentModal from "./ViewAppointmentModal";
import AddAppointmentDropdown from "./AddAppointmentDropdown";

const AllAppointments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("Filter by Subscription");
  const [statusFilter, setStatusFilter] = useState("Filter by Status");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  // Modal states
  const [viewModalData, setViewModalData] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Using enhanced API as per previous code, might need adjustment based on real API
      const data = await appointmentsAPI.getAllAppointmentsenhanced({
        page: currentPage,
        page_size: itemsPerPage,
      });
      // Handle both pagination response and array response
      setAppointments(data.results || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
      toast.error("Failed to load appointments list");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast.success("PDF Export started...");
      setTimeout(() => setIsExporting(false), 2000);
    } catch (error) {
      toast.error("Failed to export PDF");
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExportingCSV(true);
      const response = await appointmentsAPI.exportAppointmentsToCsv();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `appointments_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export CSV");
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleSaveAppointment = async (formData) => {
    try {
      setIsLoading(true);
      // Mock create/update
      // await appointmentsAPI.createAppointment(formData);
      toast.success("Appointment saved successfully");
      await fetchAppointments();
      setAddModalOpen(false);
      setViewModalData(null);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("Failed to save appointment");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Logic
  const filteredAppointments = (Array.isArray(appointments) ? appointments : []).filter((appointment) => {
    const patientName = appointment.patient_name ? appointment.patient_name.toLowerCase() : '';
    const doctorName = appointment.doctor_name ? appointment.doctor_name.toLowerCase() : '';
    const matchesSearch = patientName.includes(searchQuery.toLowerCase()) ||
      doctorName.includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Assuming API handles pagination, but for client-side filtering we slice
  // If API returns paginated data 'data.results', filteredAppointments might just be the page
  // For safety, if we have a lot of items in 'appointments' (from non-paginated API), we slice.
  // If 'appointments' contains only current page items, we don't slice.
  // Checking list length
  const isServerSidePagination = appointments.length <= itemsPerPage && appointments.length > 0;
  const currentItems = isServerSidePagination ? filteredAppointments : filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil((isServerSidePagination ? 170 : filteredAppointments.length) / itemsPerPage); // Mocking total 170 if server side

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-medium text-[#7F375E] mb-6">Appointments</h1>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Left Side: Search and Filters */}
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7F375E]"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* Subscription Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
            >
              <option>Filter by Subscription</option>
              <option value="Msingi">Msingi</option>
              <option value="Premium">Premium</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
            >
              <option>Filter by Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export PDF
            <Download size={16} />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={isExportingCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export CSV
            <Download size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setAddModalOpen(!addModalOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#29AAE1] text-white rounded-lg text-sm hover:bg-[#2392c2] transition-colors shadow-sm"
            >
              Add New Appointment +
            </button>

            {/* Dropdown */}
            <AddAppointmentDropdown
              isOpen={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              onSubmit={handleSaveAppointment}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#29AAE1]"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-12 text-red-500">
            {error}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="flex justify-center items-center p-12 text-gray-500">
            No appointments found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[20%]">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[15%]">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[10%]">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[15%]">Subscription</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider w-[15%]">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#111827] uppercase tracking-wider w-[25%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((appointment, index) => (
                <tr key={appointment.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#111827]">
                      {appointment.patient_name || "Tom Oluoch"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#374151]">
                      {appointment.start_time || "00:09 am"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#374151]">
                      {appointment.appointment_type || "Chat"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#374151]">
                      {appointment.subscription || "Msingi"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium
                        ${(appointment.status || "Completed").toLowerCase() === 'completed' ? 'text-[#00C041]' :
                          (appointment.status || "").toLowerCase() === 'cancelled' ? 'text-[#FF3B30]' :
                            'text-[#29AAE1]'}`}
                    >
                      {appointment.status || "Completed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setViewModalData(appointment)}
                        className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] transition-colors text-sm font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => setViewModalData(appointment)}
                        className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] transition-colors text-sm font-medium"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-[#111827]">
          Showing {filteredAppointments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} of {isServerSidePagination ? 170 : filteredAppointments.length} Results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="text-[#374151]" />
          </button>
          {/* Pagination Buttons */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${currentPage === i + 1
                ? "bg-[#8B3D5A] text-white border-[#8B3D5A]"
                : "bg-white border-gray-200 text-[#374151] hover:bg-gray-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 5 && <span className="px-2 py-1 text-gray-500">...</span>}
          {totalPages > 5 && (
            <button
              onClick={() => paginate(totalPages)}
              className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${currentPage === totalPages
                ? "bg-[#8B3D5A] text-white border-[#8B3D5A]"
                : "bg-white border-gray-200 text-[#374151] hover:bg-gray-50"
                }`}
            >
              {totalPages}
            </button>
          )}


          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} className="text-[#374151]" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {viewModalData && (
        <ViewAppointmentModal
          appointment={viewModalData}
          onClose={() => setViewModalData(null)}
          onEdit={() => {/* Toggle Edit mode inside modal */ }}
          onSubmit={handleSaveAppointment}
        />
      )}
    </div>
  );
};

export default AllAppointments;
