"use client";
import React, { useState, useEffect } from "react";
import { Search, Eye, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable";

// Dummy data
const dummyLogs = [
  {
    id: 1,
    username: "Doe Mike",
    activity: "Logged In",
    email: "doe.mike@example.com",
    role: "Admin",
    timeSpent: "2 Hours",
    dateJoined: "16 August 2023",
    lastActive: "16 August 2023",
    status: "Active",
  },
  {
    id: 2,
    username: "Jude Doe",
    activity: "Added A User",
    email: "jude.doe@example.com",
    role: "Admin",
    timeSpent: "2 Hours",
    dateJoined: "16 August 2023",
    lastActive: "16 August 2023",
    status: "Active",
  },
  {
    id: 3,
    username: "Jamie Doe",
    activity: "Added A User",
    email: "jamie.doe@example.com",
    role: "Admin",
    timeSpent: "2 Hours",
    dateJoined: "16 August 2023",
    lastActive: "16 August 2023",
    status: "Inactive",
  },
  {
    id: 4,
    username: "Full Name",
    activity: "Added A User",
    email: "fullname1@example.com",
    role: "Admin",
    timeSpent: "2 Hours",
    dateJoined: "16 August 2023",
    lastActive: "16 August 2023",
    status: "Active",
  },
  {
    id: 5,
    username: "Full Name",
    activity: "+254 Added A User 000000",
    email: "fullname2@example.com",
    role: "Admin",
    timeSpent: "2 Hours",
    dateJoined: "16 August 2023",
    lastActive: "16 August 2023",
    status: "Active",
  },
];

const Auditlogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [logs, setLogs] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setLogs(dummyLogs); 
  }, []);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const exportToCsv = () => {
    toast.success("Exported to CSV (dummy)");
  };

  const exportToPdf = () => {
    toast.success("Exported to PDF (dummy)");
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || log.role === roleFilter;
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    const matchesAction =
      actionFilter === "All" || log.activity.includes(actionFilter);
    return matchesSearch && matchesRole && matchesStatus && matchesAction;
  });

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
    },
    { name: "USERNAME", selector: (row) => row.username, sortable: true },
    { name: "ACTIVITY", selector: (row) => row.activity },
    { name: "EMAIL ADDRESS", selector: (row) => row.email },
    { name: "ROLE", selector: (row) => row.role },
    { name: "TIME SPENT", selector: (row) => row.timeSpent },
    { name: "DATE JOINED", selector: (row) => row.dateJoined },
    { name: "LAST ACTIVE", selector: (row) => row.lastActive },
    {
      name: "STATUS",
      cell: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-end gap-6 mb-4">
        <button className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
          <Eye size={18} /> View Logs
        </button>
        <button className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
          <Pencil size={18} /> Edit
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-black mb-2">Search by Name</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-black mb-2">Filter by Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
          >
            <option value="All">All</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-black mb-2">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-black mb-2">Filter by Action Type</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
          >
            <option value="All">All</option>
            <option value="Logged In">Logged In</option>
            <option value="Added A User">Added A User</option>
          </select>
        </div>

        <div>
          <label className="block text-black mb-2">Filter by Date</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
          >
            <option value="All">All</option>
            <option value="16 August 2023">16 August 2023</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {filteredLogs.length > 0 ? (
            // @ts-ignore
          <CustomTable columns={columns} data={filteredLogs} />
        ) : (
          <div className="flex justify-center items-center p-8 text-gray-500">
            No logs found
          </div>
        )}
      </div>

     <div className="mt-4 flex gap-4">
  <button
    onClick={exportToPdf}
    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-[#5f5c5c] rounded-lg font-semibold shadow transition bg-white"
    type="button"
  >
    Export PDF
  </button>
  <button
    onClick={exportToCsv}
    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-[#5f5c5c] rounded-lg font-semibold shadow transition bg-white"
    type="button"
  >
    Export CSV
  </button>
</div>
    </div>
  );
};

export default Auditlogs;
