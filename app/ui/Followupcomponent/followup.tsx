"use client";
import React, { useEffect, useState, useMemo } from "react";
import { AlertCircle, Download, MoreVertical, Search } from "lucide-react";
import CustomTable from "../../components/CustomTable";
import { toast } from "react-toastify";
import { packageTracker } from "../../utils/api";
import {followupAPI} from "../../utils/api"

interface FollowupSummary {
    total_patients_tracked?: number;
    missed_appointments?: number;
    missed_med_reminders?: number;
    critical_non_compliant?: number;
    compliance_rate?: number;
}

interface PaginationResponse<T> {
    count: number;
    total_pages: number;
    current_page: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
    results: T[];
}


export interface GetAllPackagesParams {
    package_type?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
}


const Followuppage = () => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [openDropdown, setOpenDropdown] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [packages, setPackages] = useState<any[]>([]);
    const [listFollowups,setListFollowups] = useState<any[]>([]);
    const [pagination, setPagination] = useState<Omit<PaginationResponse<any>, "results"> | null>(null);
    const [telecommunicationSummary, setTelecommunicationSummary] = useState<FollowupSummary>({});

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchFollowupList= async () => {
        try {
            setLoading(true);
            setError(null);

            const data: PaginationResponse<any> = await followupAPI.getAllFollowups({
                page,
                page_size: pageSize,
            });

            setListFollowups(data?.results || []);
            setPagination({
                count: data?.count || 0,
                total_pages: data?.total_pages || 1,
                current_page: data?.current_page || 1,
                page_size: data?.page_size || 10,
                has_next: data?.has_next || false,
                has_previous: data?.has_previous || false,
            });
        } catch (err) {
            setError("Failed to fetch followups. Please try again later.");
            toast.error("Failed to fetch followups. Please try again later.");
            setListFollowups([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowupSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await followupAPI.getFollowupSummary();
            setTelecommunicationSummary(data || {});
        } catch (err) {
            console.error("Error fetching followup summary:", err);
            setError("Failed to fetch followup summary. Please try again later.");
            toast.error("Failed to fetch followup summary. Please try again later.");
            setTelecommunicationSummary({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowupSummary();
    }, []);

    useEffect(() => {
        fetchFollowupList();
    }, []);

  

    const getStatusBadge = (status: string) => {
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

        { name: "Patient Name", selector: (row: any) => row.patient_name || "Unknown", sortable: true },
        { name: "Phone", selector: (row: any) => row.phone || "Unknown", sortable: true },
        { name: "Risk Level", selector: (row: any) => row.risk_level || "Unknown", sortable: true },
        { name: "Missed", selector: (row: any) => row.missed || "Undefined", sortable: true },
        { name: "Follow-Up Type", selector: (row: any) => row.appointment_type || "Undefined", sortable: true },
        { name: "Status", cell: (row: any) => getStatusBadge(row.status), sortable: true },

        {
            name: "Actions",
            cell: (row: any) => (
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
    } else if (packages.length === 0) {
        contentToRender = (
            <div className="flex justify-center items-center p-8 text-gray-500">
                No packages found
            </div>
        );
    } else {
        contentToRender = (
            <CustomTable
                columns={columns}
                data={listFollowups}
                isLoading={loading}
                error={error}
                paginationServer
                paginationTotalRows={pagination?.count || 0}
                onChangePage={(newPage) => setPage(newPage)}
                onChangeRowsPerPage={(newPageSize, newPage) => {
                    setPageSize(newPageSize);
                    setPage(newPage);
                }}
            />
        );
    }

    const stats = [
        { title: "Total Patients Tracked", value: telecommunicationSummary?.total_patients_tracked, change: "+10%", positive: true },
        { title: "Missed Appointments", value: telecommunicationSummary?.missed_appointments, change: "-10%", positive: false },
        { title: "Missed Med Reminders", value: telecommunicationSummary?.missed_med_reminders, change: "+10%", positive: true },
        { title: "Critical Non-Compliant", value: telecommunicationSummary?.critical_non_compliant, change: "+10%", positive: true },
    ];

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats?.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow border border-gray-200"
                    >
                        <p className="text-gray-600 text-sm">{item.title}</p>
                        <h2 className="text-2xl font-bold mt-2">{item.value ?? 0}</h2>
                        <p
                            className={`text-sm font-semibold mt-1 ${item.positive ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {item.change}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
                    <div>
                        <label htmlFor="search" className="block text-black mb-2">
                            Search by Title
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder="Enter title..."
                                //   value={searchQuery}
                                //   onChange={handleSearch}
                                className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
                            />
                            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                        </div>
                    </div>



                    <div>
                        <label htmlFor="search" className="block text-black mb-2">
                            Filter by Risk Level
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder="Enter title..."
                                className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
                            />
                            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="search" className="block text-black mb-2">
                            Filter by Follow-Up Type
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder="Enter title..."
                                className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none text-[#29AAE1]"
                            />
                            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">


                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
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

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                {contentToRender}
            </div>
        </div>
    );
};

export default Followuppage;
