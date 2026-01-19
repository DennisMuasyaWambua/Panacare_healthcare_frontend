"use client";
import React, { useState } from "react";
import { Search, Download, Upload, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable";

const AuditLogsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [actionFilter, setActionFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    // Mock Data matching the image
    const mockLogs = [
        {
            id: 1,
            user: {
                name: "John Doe",
                email: "Johndoe@Example.Com",
                initials: "JD",
                avatarColor: "bg-teal-100 text-teal-600"
            },
            activity: "Logged In",
            role: "Admin",
            timeSpent: "2 Hours",
            dateJoined: "16 August 2023",
            lastActive: "16 August 2023",
            status: "Active",
        },
        {
            id: 2,
            user: {
                name: "John Doe",
                email: "Johndoe@Example.Com",
                initials: "JD",
                avatarColor: "bg-orange-100 text-orange-600"
            },
            activity: "Added A User",
            role: "Admin",
            timeSpent: "2 Hours",
            dateJoined: "16 August 2023",
            lastActive: "16 August 2023",
            status: "Active",
        },
        {
            id: 3,
            user: {
                name: "John Doe",
                email: "Johndoe@Example.Com",
                initials: "JD",
                avatarColor: "bg-gray-100 text-gray-600"
            },
            activity: "Added A User",
            role: "Admin",
            timeSpent: "2 Hours",
            dateJoined: "16 August 2023",
            lastActive: "16 August 2023",
            status: "Inactive",
        },
        {
            id: 4,
            user: {
                name: "John Doe",
                email: "Johndoe@Example.Com",
                initials: "JD",
                avatarColor: "bg-purple-100 text-purple-600"
            },
            activity: "Added A User",
            role: "Admin",
            timeSpent: "2 Hours",
            dateJoined: "16 August 2023",
            lastActive: "16 August 2023",
            status: "Active",
        },
        {
            id: 5,
            user: {
                name: "John Doe",
                email: "Johndoe@Example.Com",
                initials: "JD",
                avatarColor: "bg-yellow-100 text-yellow-600"
            },
            activity: "Edited User",
            role: "Admin",
            timeSpent: "2 Hours",
            dateJoined: "16 August 2023",
            lastActive: "16 August 2023",
            status: "Inactive",
        },
        {
            id: 6,
            user: {
                name: "John Doe",
                email: "Johndoe@Example.Com",
                initials: "JD",
                avatarColor: "bg-gray-800 text-white"
            },
            activity: "Uploaded Article",
            role: "Admin",
            timeSpent: "2 Hours",
            dateJoined: "16 August 2023",
            lastActive: "16 August 2023",
            status: "Active",
        },
        {
            id: 7,
            user: {
                name: "John Doe",
                email: "Johndoe@Example.Com",
                initials: "JD",
                avatarColor: "bg-teal-100 text-teal-600"
            },
            activity: "Uploaded Article",
            role: "Admin",
            timeSpent: "2 Hours",
            dateJoined: "16 August 2023",
            lastActive: "16 August 2023",
            status: "Active",
        },
    ];

    const handleSearch = (e) => setSearchQuery(e.target.value);
    const handleRoleFilter = (e) => setRoleFilter(e.target.value);
    const handleStatusFilter = (e) => setStatusFilter(e.target.value);
    const handleActionFilter = (e) => setActionFilter(e.target.value);

    const handleRowSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const filteredLogs = mockLogs.filter((log) => {
        const matchesSearch =
            log.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "All" || log.role === roleFilter;
        const matchesStatus = statusFilter === "All" || log.status === statusFilter;
        // Mock action filter logic
        const matchesAction = actionFilter === "All" || true;
        return matchesSearch && matchesRole && matchesStatus && matchesAction;
    });

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-[#29AAE1] focus:ring-[#29AAE1]"
                />
            ),
            width: "60px",
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                    className="w-5 h-5 rounded border-gray-300 text-[#29AAE1] focus:ring-[#29AAE1]"
                />
            ),
            ignoreRowClick: true,
        },
        {
            name: "Patient's Name",
            selector: (row) => row.user.name,
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${row.user.avatarColor}`}>
                        {row.user.initials}
                    </div>
                    <span className="font-medium text-gray-900">{row.user.name}</span>
                </div>
            ),
            width: "180px",
        },
        {
            name: "Activity",
            selector: (row) => row.activity,
            sortable: true,
            width: "150px",
        },
        {
            name: "Email Address",
            selector: (row) => row.user.email,
            sortable: true,
            width: "200px",
        },
        {
            name: "Role",
            selector: (row) => row.role,
            sortable: true,
            width: "100px",
        },
        {
            name: "Time Spent",
            selector: (row) => row.timeSpent,
            sortable: true,
            width: "120px",
        },
        {
            name: "Date Joined",
            selector: (row) => row.dateJoined,
            sortable: true,
            width: "150px",
        },
        {
            name: "Last Active",
            selector: (row) => row.lastActive,
            sortable: true,
            width: "150px",
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <span className={`px-2 py-1 rounded-md text-xs font-medium text-white
            ${row.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {row.status}
                </span>
            ),
            width: "100px",
        },
        {
            name: "",
            width: "50px",
            cell: () => (
                <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical size={18} />
                </button>
            )
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                color: "#111827",
                fontSize: "13px",
                fontWeight: "600",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "12px",
                paddingBottom: "12px",
                fontSize: "13px",
                color: "#374151",
            },
        },
        rows: {
            style: {
                minHeight: "64px",
            }
        }
    };

    const exportToCsv = () => {
        toast.success("Exported to CSV");
    };

    const exportToPdf = () => {
        toast.success("Exported to PDF");
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-2xl font-normal text-[#7F375E] mb-8">Audit Logs</h1>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-grow flex-wrap">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-sm"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={handleRoleFilter}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-sm text-gray-700 w-full md:w-40"
                    >
                        <option value="All">Filter by Role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-sm text-gray-700 w-full md:w-40"
                    >
                        <option value="All">Filter by Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <select
                        value={actionFilter}
                        onChange={handleActionFilter}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-sm text-gray-700 w-full md:w-48"
                    >
                        <option value="All">Filter by Action Type</option>
                        <option value="Login">Login</option>
                        <option value="Update">Update</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-start lg:justify-end flex-wrap">
                    <button
                        onClick={exportToPdf}
                        className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition whitespace-nowrap"
                    >
                        Export PDF <Upload className="ml-2 rotate-90" size={16} />
                    </button>
                    <button
                        onClick={exportToCsv}
                        className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition whitespace-nowrap"
                    >
                        Export CSV <Upload className="ml-2 rotate-90" size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 p-2">
                <CustomTable
                    columns={columns}
                    data={filteredLogs}
                    isLoading={isLoading}
                    error={error}
                    customStyles={customStyles}
                />
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 font-medium">
                        Showing 11 of 170 Results
                    </div>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">←</button>
                        <button className="px-3 py-1 bg-[#7F375E] text-white rounded">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">2</button>
                        <span className="px-2 py-1 text-gray-500">...</span>
                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">9</button>
                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">10</button>
                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">→</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogsPage;
