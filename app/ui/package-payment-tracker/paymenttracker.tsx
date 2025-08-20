"use client";
import React, { useEffect, useState, useMemo } from "react";
import { AlertCircle, Download, MoreVertical } from "lucide-react";
import CustomTable from "../../components/CustomTable";
import { subscriptions } from "../../utils/api";
import { toast } from "react-toastify";

const Paymenttracker = () => {
  const [packageFilter, setPackageFilter] = useState("Daraja");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptions.getAllSubs();
      setPackages(data || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError("Failed to fetch subscriptions. Please try again later.");
      toast.error("Failed to fetch subscriptions. Please try again later.");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="px-3 py-1 text-sm font-semibold text-green-600 rounded-full">● Active</span>;
      case "Expiring Soon":
        return <span className="px-3 py-1 text-sm font-semibold text-yellow-600 rounded-full">● Expiring Soon</span>;
      case "Overdue":
        return <span className="px-3 py-1 text-sm font-semibold text-red-600 rounded-full">● Overdue</span>;
      default:
        return null;
    }
  };

  const columns = useMemo(() => [
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
    },
    { name: "Name", selector: (row) => row.patient_name || "Unknown", sortable: true },
    { name: "Phone", selector: (row) => row.phone || "Unknown", sortable: true },
    { name: "Package", selector: (row) => row.package_name || "Unknown", sortable: true },
    { name: "Start Date", selector: (row) => row.start_date || "Undefined", sortable: true },
    { name: "Expiry Date", selector: (row) => row.end_date || "Undefined", sortable: true },
    { name: "Status", cell: (row) => getStatusBadge(row.is_active), sortable: true },
    {
      name: "Actions",
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
  ], [selectedRows]);

  let contentToRender;
  if (loading) {
    contentToRender = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading Packages...</p>
      </div>
    );
  } else if (error) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );
  } else if (subscriptions.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No articles found matching your filters
      </div>
    );
  } else {
    contentToRender = (
      <CustomTable
        columns={columns}
        data={packages}
        isLoading={loading}
        error={error}
      />
    );
  }
  

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#7F375E] mb-6">Payment Tracker</h1>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Active Subscribers", value: 100, change: "+10%", positive: true },
          { title: "Expiring This Week", value: 6, change: "-10%", positive: false },
          { title: "Renewed This Month", value: 20, change: "+10%", positive: true },
          { title: "Overdue (Not Renewed)", value: 100, change: "+10%", positive: true },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <p className="text-gray-600 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            <p
              className={`text-sm font-semibold mt-1 ${
                item.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.change}
            </p>
          </div>
        ))}
      </div>

      {/* Controls Area */}
      <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
        <h2 className="text-lg font-md text-black">Main Table View</h2>

        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
          <button
            className="px-4 py-2 border border-[#29AAE1] text-[#29AAE1] rounded-lg font-semibold hover:bg-blue-50 transition w-full md:w-fit cursor-pointer"
            type="button"
          >
            System Revenue
          </button>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-black cursor-pointer"
            >
              <option value="Daraja">Daraja</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
            </select>

            <button
              className="flex items-center justify-center px-4 py-2 bg-[#F1F8FD] border border-gray-300  text-black  rounded-lg font-md cursor-pointer shadow transition w-full sm:w-auto"
              type="button"
            >
              <Download className="mr-2" size={18} />
              Export pdf
            </button>
            <button
              className="flex items-center justify-center px-4 py-2 bg-[#F1F8FD] border border-gray-300  text-black  rounded-lg font-md cursor-pointer shadow transition w-full sm:w-auto"
              type="button"
            >
              <Download className="mr-2" size={18} />
              Export csv
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {contentToRender}
      </div>
    </div>
  );
};

export default Paymenttracker;
