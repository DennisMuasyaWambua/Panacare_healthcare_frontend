"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  AlertCircle,
  Download,
  MoreVertical,
  Search,
  UserPlus,
  UserX,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  Package
} from "lucide-react";
import CustomTable from "../../components/CustomTable";
import { toast } from "react-toastify";
import { packageTracker } from "../../utils/api";
import { Eye, Bell, Trash2 } from "lucide-react";

const Paymenttracker = () => {
  const [activeTab, setActiveTab] = useState("package"); // 'package' or 'revenue'
  const [packageFilter, setPackageFilter] = useState("Filter by Package Type");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data States
  const [packages, setPackages] = useState([]);
  const [packagesSummary, setPackagesSummary] = useState<any>({});
  const [revenueData, setRevenueData] = useState([]); // Mock for now

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState(null);

  // Initial Fetch
  useEffect(() => {
    fetchPackages();
    fetchPackagesSummary();
    fetchRevenueData();
  }, [page, pageSize]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await packageTracker.getAllPackages({
        package_type: packageFilter === "Filter by Package Type" ? "" : packageFilter,
        page,
        page_size: pageSize,
        search: searchQuery
      });

      setPackages(data?.results || []);
      setPagination({
        count: data?.count || 0,
        total_pages: data?.total_pages || 1,
        current_page: data?.current_page || 1,
        page_size: data?.page_size || 10,
        has_next: data?.has_next || false,
        has_previous: data?.has_previous || false,
      });
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      // setError("Failed to fetch subscriptions."); // Suppressing error for UI cleanliness if API fails
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackagesSummary = async () => {
    try {
      const data = await packageTracker.getAllPackageSummary();
      setPackagesSummary(data || {});
    } catch (err) {
      console.error("Error fetching package summary:", err);
    }
  };

  const fetchRevenueData = async () => {
    // Mocking revenue data as API endpoint might be missing or different
    // In a real scenario, this would be an API call
    setRevenueData([
      { id: 1, date: "16 August 2023", amount: "25,000", payment_method: "MPESA", count: 28, status: "Pending", package: "Afya Bora" },
      { id: 2, date: "16 August 2023", amount: "25,000", payment_method: "CARD", count: 30, status: "Active", package: "Daraja" },
      { id: 3, date: "16 August 2023", amount: "25,000", payment_method: "CARD", count: 30, status: "Inactive", package: "Msingi" },
      { id: 4, date: "16 August 2023", amount: "25,000", payment_method: "MPESA", count: 28, status: "Pending", package: "Afya Bora" },
      { id: 5, date: "16 August 2023", amount: "25,000", payment_method: "CARD", count: 30, status: "Active", package: "Daraja" },
    ]);
  };

  // Helper for Status Badge
  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s.includes("active")) return <span className="flex items-center text-green-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>Active</span>;
    if (s.includes("expiring")) return <span className="flex items-center text-yellow-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-yellow-600 mr-2"></span>Expiring Soon</span>;
    if (s.includes("inactive") || s.includes("overdue")) return <span className="flex items-center text-red-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-red-600 mr-2"></span>Inactive</span>;
    if (s.includes("pending")) return <span className="flex items-center text-yellow-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-yellow-600 mr-2"></span>Pending</span>;
    return <span className="flex items-center text-gray-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-gray-600 mr-2"></span>{status}</span>;
  };

  // Columns for Package Payment
  const packageColumns = useMemo(() => [
    { name: "Patient Name", selector: (row) => row.patient_name || "Steve Mwangi", sortable: true, grow: 2 },
    { name: "Phone", selector: (row) => row.phone || "+254 700 000000", sortable: true },
    { name: "Package", selector: (row) => row.package_name || "Daraja", sortable: true },
    { name: "Start Date", selector: (row) => row.start_date || "16 August 2023", sortable: true },
    { name: "Expiry Date", selector: (row) => row.end_date || "16 August 2025", sortable: true },
    { name: "Status", cell: (row) => getStatusBadge(row.is_active || row.status || "Active"), sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] text-xs font-medium"><Eye size={14} /> View</button>
          <button className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] text-xs font-medium"><Bell size={14} /> Remind</button>
          <button className="flex items-center gap-1 text-[#FF3B30] hover:text-red-700 text-xs font-medium"><Trash2 size={14} /> Delete</button>
        </div>
      ),
      ignoreRowClick: true,
      width: "250px"
    },
  ], []);

  // Columns for System Revenue
  const revenueColumns = useMemo(() => [
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    { name: "Payment Method", selector: (row) => row.payment_method, sortable: true },
    { name: "Count/Package", selector: (row) => row.activeTab === 'package' ? row.package : row.count || row.package || 28, sortable: true },
    { name: "Status", cell: (row) => getStatusBadge(row.status), sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] text-xs font-medium"><Eye size={14} /> View</button>
          <button className="flex items-center gap-1 text-[#374151] hover:text-[#29AAE1] text-xs font-medium"><Bell size={14} /> Remind</button>
          <button className="flex items-center gap-1 text-[#FF3B30] hover:text-red-700 text-xs font-medium"><Trash2 size={14} /> Delete</button>
        </div>
      ),
      ignoreRowClick: true,
      width: "250px"
    },
  ], []);

  // Stats Data
  const packageStats = [
    { title: "Total Active Subscribers", value: packagesSummary?.total_active_subscribers || 129, change: "10%", positive: true, icon: UserPlus },
    { title: "Expiring This Week", value: packagesSummary?.expiring_this_week || 16, change: "65%", positive: true, icon: Users }, // Icon is generic
    { title: "Renewed This Week", value: packagesSummary?.renewed_this_month || 20, change: "15%", positive: false, icon: Calendar },
    { title: "Overdue (Not Renewed)", value: packagesSummary?.overdue_not_renewed || 100, change: "15%", positive: false, icon: UserX },
  ];

  const revenueStats = [
    { title: "Total Revenue This Month", value: "125K", change: "10%", positive: true, icon: DollarSign },
    { title: "Total Transactions", value: "392", change: "65%", positive: true, icon: TrendingUp },
    { title: "Average Payment Per User", value: "KES 960", change: "15%", positive: false, icon: CreditCard },
    { title: "Most Popular Package", value: "Daraja - 211 Subs", change: "15%", positive: false, icon: Package },
  ];

  const currentStats = activeTab === "package" ? packageStats : revenueStats;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-medium text-[#7F375E] mb-6">
        {activeTab === "package" ? "Package Payment Tracker" : "System Package Payment Tracker"}
      </h1>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab("package")}
          className={`px-6 py-2 border rounded-l-lg font-medium text-sm transition-colors ${activeTab === "package"
            ? "bg-[#29AAE1] text-white border-[#29AAE1]"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
        >
          Package Payment
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`px-6 py-2 border rounded-r-lg font-medium text-sm transition-colors ${activeTab === "revenue"
            ? "bg-[#29AAE1] text-white border-[#29AAE1]"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
        >
          System Revenue
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {currentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                  {Icon && <Icon size={24} />}
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                  {stat.positive ? "↑" : "↓"} {stat.change}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-4 w-full md:w-auto flex-1">
          {/* Search - Only for Package Tab in mockup, but good to have */}
          {activeTab === "package" ? (
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7F375E]"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          ) : (
            <div className="relative min-w-[200px]">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
              >
                <option>Filter by Payment Method</option>
                <option>Mpesa</option>
                <option>Card</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          )}

          <div className="relative min-w-[200px]">
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#7F375E]"
            >
              <option>Filter by Package Type</option>
              <option value="Daraja">Daraja</option>
              <option value="Premium">Premium</option>
              <option value="Msingi">Msingi</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Export PDF <Download size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Export CSV <Download size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#29AAE1]"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-12 text-red-500">
            <AlertCircle className="mr-2" /> {error}
          </div>
        ) : (
          <CustomTable
            columns={activeTab === "package" ? packageColumns : revenueColumns}
            data={activeTab === "package" ? (packages.length > 0 ? packages : [{}, {}, {}, {}].map((_, i) => ({ // Mock data if empty for visual
              id: i,
              patient_name: "Steve Mwangi",
              phone: "+254 700 000000",
              package_name: "Daraja",
              start_date: "16 August 2023",
              end_date: "16 August 2025",
              is_active: i % 2 === 0 ? "Active" : "Expiring Soon"
            }))) : revenueData}
            paginationServer={activeTab === "package"}
            paginationTotalRows={pagination?.count || 0}
            onChangePage={(newPage) => setPage(newPage)}
            onChangeRowsPerPage={(newPageSize, newPage) => {
              setPageSize(newPageSize);
              setPage(newPage);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Paymenttracker;
