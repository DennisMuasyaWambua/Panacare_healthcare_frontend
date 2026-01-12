"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
    Search,
    Download,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    User,
    Eye,
    RefreshCw, // For Change Role
    Edit2,
    Trash2,
    UserX,
    AlertCircle,
    CheckCircle,
    Mail // Added Mail icon
} from "lucide-react";
import { toast } from "react-toastify";
import AddUserDropdown from "./AddUserDropdown";
import { usersAPI } from "../../utils/api";

const ListOfUsers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("Filter by Role");
    const [statusFilter, setStatusFilter] = useState("Filter by Status");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    // Data States
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Action Dropdown State
    const [openActionDropdown, setOpenActionDropdown] = useState(null); // stores user ID

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await usersAPI.getUsers();
                // Adapt API response to UI model if fields are different
                // Assuming API returns array or object with results
                const userList = Array.isArray(data) ? data : (data.results || []);

                // Map API fields if necessary (example mapping, adjust based on actual API response)
                const mappedUsers = userList.map(u => ({
                    id: u.id,
                    firstName: u.first_name || u.firstName || "Unknown",
                    lastName: u.last_name || u.lastName || "User",
                    phone: u.phone_number || u.phone || "N/A",
                    email: u.email || "N/A",
                    role: u.role || "User",
                    dateJoined: u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "N/A",
                    lastActive: u.last_login ? new Date(u.last_login).toLocaleDateString() : "N/A",
                    experience: u.experience || "N/A", // Might not exist in backend yet
                    status: u.is_active ? "Active" : "Inactive",
                    isVerified: u.is_verified || false
                }));

                setUsers(mappedUsers);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
                // Fallback to empty list or keep mock for demo if API fails completely
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (userData) => {
        try {
            // Need to map frontend form data to backend expected format
            // AddUserDropdown sends: firstName, lastName, status, email, role, experience, password

            // Generate username from email or name
            const username = userData.email.split('@')[0] || userData.firstName.toLowerCase();

            const payload = {
                username: username,
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                password: userData.password || "Password123!", // Use provided password or default
                role: userData.role, // "admin", "doctor", "patient"
                role_names: [userData.role], // Also include as list just in case
                phone_number: "", // Optional but nice to have structure
                address: "",
                is_active: userData.status === 'Active',
            };

            await usersAPI.register(payload); // Using register endpoint as verified in api.js
            toast.success("User added successfully!");
            setIsAddUserOpen(false);

            // Refresh list
            const data = await usersAPI.getUsers();
            const userList = Array.isArray(data) ? data : (data.results || []);
            const mappedUsers = userList.map(u => ({
                id: u.id,
                firstName: u.first_name || u.firstName || "Unknown",
                lastName: u.last_name || u.lastName || "User",
                phone: u.phone_number || u.phone || "N/A",
                email: u.email || "N/A",
                role: u.role || (u.roles && u.roles.length > 0 ? u.roles[0].name : "User"),
                dateJoined: u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "N/A",
                lastActive: u.last_login ? new Date(u.last_login).toLocaleDateString() : "N/A",
                experience: u.experience || "N/A",
                status: u.is_active ? "Active" : "Inactive",
                isVerified: u.is_verified || false
            }));
            setUsers(mappedUsers);

        } catch (error) {
            console.error("Error adding user:", error);
            // Improve error display
            let errorMessage = error.message || "Failed to add user.";
            if (error.response && typeof error.response === 'object') {
                const fieldErrors = [];
                Object.entries(error.response).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        fieldErrors.push(`${key}: ${value.join(', ')}`);
                    } else if (typeof value === 'string') {
                        fieldErrors.push(`${key}: ${value}`);
                    }
                });

                if (fieldErrors.length > 0) {
                    errorMessage = fieldErrors.join('\n');
                }
            }
            toast.error(errorMessage);
        }
    };


    const handleRowSelect = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(users.map(u => u.id));
        } else {
            setSelectedRows([]);
        }
    };

    // Close Dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openActionDropdown && !event.target.closest('.action-dropdown-container')) {
                setOpenActionDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openActionDropdown]);


    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "Filter by Role" || user.role === roleFilter;
        const matchesStatus = statusFilter === "Filter by Status" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans"> {/* Adjusted padding for mobile */}
            <h1 className="text-2xl font-medium text-[#7F375E] mb-6">Users</h1>

            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto flex-1">
                    <div className="relative text-gray-700 flex-1 w-full md:max-w-sm">
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7F375E]"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0"> {/* Mobile scroll for filters if tight */}
                        <div className="relative min-w-[140px] flex-1 md:flex-none">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
                            >
                                <option>Filter by Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>

                        <div className="relative min-w-[140px] flex-1 md:flex-none">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
                            >
                                <option>Filter by Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-1 xl:flex-none justify-center">
                        Export PDF <Download size={16} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-1 xl:flex-none justify-center">
                        Export CSV <Download size={16} />
                    </button>

                    <div className="relative flex-1 xl:flex-none">
                        <button
                            onClick={() => setIsAddUserOpen(!isAddUserOpen)}
                            className="w-full xl:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#29AAE1] text-white rounded-lg text-sm hover:bg-[#2392c2] transition-colors shadow-sm font-medium"
                        >
                            Add User +
                        </button>
                        <AddUserDropdown
                            isOpen={isAddUserOpen}
                            onClose={() => setIsAddUserOpen(false)}
                            onSubmit={handleAddUser}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible">
                {/* Responsive container for table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#29AAE1]"></div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center p-12 text-red-500">
                            <AlertCircle className="mr-2" /> {error}
                        </div>
                    ) : (
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-4 w-[50px]">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-[#29AAE1] focus:ring-[#29AAE1]"
                                            onChange={handleSelectAll}
                                            checked={selectedRows.length === users.length && users.length > 0}
                                        />
                                    </th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider">User's Name</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider hidden lg:table-cell">Phone Number</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider">Email Address</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider hidden xl:table-cell">Date Joined</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider hidden xl:table-cell">Last Active</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider hidden lg:table-cell">Experience</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors relative">
                                        <td className="px-3 py-4">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-gray-300 text-[#29AAE1] focus:ring-[#29AAE1]"
                                                checked={selectedRows.includes(user.id)}
                                                onChange={() => handleRowSelect(user.id)}
                                            />
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#29AAE1]">
                                                    <User size={16} />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium text-[#111827]">{user.firstName} {user.lastName}</span>
                                                    {user.isVerified && (
                                                        <span className="text-blue-500" title="Verified">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#374151] hidden lg:table-cell">{user.phone}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#374151]">{user.email}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#374151]">{user.role}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#374151] hidden xl:table-cell">{user.dateJoined}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#374151] hidden xl:table-cell">{user.lastActive}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#374151] hidden lg:table-cell">{user.experience}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 rounded text-xs font-medium text-white ${user.status === 'Active' ? 'bg-[#00C041]' : 'bg-[#FF3B30]'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right action-dropdown-container relative">
                                            <button
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenActionDropdown(openActionDropdown === user.id ? null : user.id);
                                                }}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {/* Action Dropdown */}
                                            {openActionDropdown === user.id && (
                                                <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 text-left overflow-hidden">
                                                    <div className="py-1">
                                                        <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Eye size={16} className="text-gray-400" />
                                                            View
                                                        </button>
                                                        <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <RefreshCw size={16} className="text-gray-400" />
                                                            Change Role
                                                        </button>
                                                        <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Edit2 size={16} className="text-gray-400" />
                                                            Edit
                                                        </button>

                                                        {user.role === 'Doctor' && !user.isVerified && (
                                                            <button
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        await doctorsAPI.verifyDoctor(user.id);
                                                                        toast.success("Doctor verified successfully");
                                                                        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isVerified: true } : u));
                                                                    } catch (err) {
                                                                        toast.error("Failed to verify doctor");
                                                                    }
                                                                    setOpenActionDropdown(null);
                                                                }}
                                                                className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                                            >
                                                                <CheckCircle size={16} className="text-blue-500" />
                                                                Verify Doctor
                                                            </button>
                                                        )}

                                                        {!user.isVerified && (
                                                            <button
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        await usersAPI.resendVerification(user.email);
                                                                        toast.success("Verification email sent successfully");
                                                                    } catch (err) {
                                                                        console.error("Failed to resend verification:", err);
                                                                        toast.error(err.message || "Failed to send verification email");
                                                                    }
                                                                    setOpenActionDropdown(null);
                                                                }}
                                                                className="w-full px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                                                            >
                                                                <Mail size={16} className="text-purple-500" />
                                                                Resend Verification Email
                                                            </button>
                                                        )}

                                                        <button className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                            <UserX size={16} className="text-red-500" />
                                                            Deactivate User
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-[#111827]">
                    Showing {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} of {filteredUsers.length} Results
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
                    {Array.from({ length: totalPages }, (_, i) => (
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


                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} className="text-[#374151]" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ListOfUsers;
