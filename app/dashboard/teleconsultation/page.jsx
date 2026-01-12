"use client";

import React, { useState, useEffect } from "react";
import { Search, Video, Phone, Calendar, Clock, User, Monitor, Filter, Download, Plus, Eye, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import CustomTable from "../../components/CustomTable";

const TeleconsultationPage = () => {
  const [teleconsultations, setTeleconsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeActionRow, setActiveActionRow] = useState(null);

  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      width: "12%",
    },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
      width: "10%",
    },
    {
      name: "Patient",
      selector: (row) => row.patientName,
      sortable: true,
      width: "18%",
    },
    {
      name: "Doctor",
      selector: (row) => row.doctorName,
      sortable: true,
      width: "18%",
    },
    {
      name: "Clinic",
      cell: () => "Homabay",
      sortable: false,
      width: "12%",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "10%",
      cell: (row) => (
        <span className="capitalize">{row.type}</span>
      ),
    },
    {
      name: "Actions",
      width: "20%",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs font-medium">
            <Eye size={16} /> View
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs font-medium">
            <Edit size={16} /> Edit
          </button>
          <button className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-medium">
            <Trash2 size={16} className="text-red-400" /> Delete
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        color: "#6B7280",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "none",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    cells: {
      style: {
        fontSize: "13px",
        color: "#111827",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "16px",
        paddingBottom: "16px",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        borderBottom: "1px solid #F3F4F6",
      }
    }
  };

  // Sample teleconsultation data - you can replace this with API calls later
  useEffect(() => {
    const fetchTeleconsultations = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const sampleTeleconsultations = [
          {
            id: 1,
            patientName: "John Doe",
            doctorName: "Dr. Sarah Wilson",
            date: "2024-08-29",
            time: "09:00 AM",
            duration: "30 min",
            type: "video",
            status: "scheduled",
            platform: "Zoom",
            sessionId: "123-456-789"
          },
          {
            id: 2,
            patientName: "Jane Smith",
            doctorName: "Dr. Michael Brown",
            date: "2024-08-29",
            time: "10:30 AM",
            duration: "45 min",
            type: "audio",
            status: "completed",
            platform: "Teams",
            sessionId: "987-654-321"
          },
          {
            id: 3,
            patientName: "Robert Johnson",
            doctorName: "Dr. Emily Davis",
            date: "2024-08-29",
            time: "02:00 PM",
            duration: "30 min",
            type: "video",
            status: "cancelled",
            platform: "Google Meet",
            sessionId: "456-789-123"
          },
          {
            id: 4,
            patientName: "Maria Garcia",
            doctorName: "Dr. James Anderson",
            date: "2024-08-30",
            time: "11:00 AM",
            duration: "60 min",
            type: "video",
            status: "in-progress",
            platform: "Zoom",
            sessionId: "789-123-456"
          }
        ];

        setTeleconsultations(sampleTeleconsultations);
      } catch (error) {
        console.error("Error fetching teleconsultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeleconsultations();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    return type === "video" ? (
      <Video className="h-4 w-4 text-[#29AAE1]" />
    ) : (
      <Phone className="h-4 w-4 text-[#29AAE1]" />
    );
  };

  const filteredTeleconsultations = teleconsultations.filter(consultation => {
    const matchesSearch =
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.platform.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || consultation.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[#7F375E]">Tele-consultation Logs</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-wrap">
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Name"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-sm text-gray-700 w-full md:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Filter by Clinic</option>
            {/* Sample clinis or keep as placeholder for now */}
            <option value="homabay">Homabay</option>
          </select>
          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-sm text-gray-700 w-full md:w-56"
          >
            <option value="">Filter by Consultation Type</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto justify-start lg:justify-end flex-wrap">
          <button className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition whitespace-nowrap">
            Export PDF <Download className="ml-2" size={16} />
          </button>
          <button className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition whitespace-nowrap">
            Export CSV <Download className="ml-2" size={16} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center">
              <Plus size={12} className="mr-0.5" /> 10%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Consultations</p>
          <p className="text-3xl font-bold text-gray-800">4.5</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center">
              <Plus size={12} className="mr-0.5" /> 65%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Completed Consultations</p>
          <p className="text-3xl font-bold text-gray-800">45</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
            <span className="text-red-500 text-xs font-bold flex items-center">
              ↓ 15%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Missed Consultations</p>
          <p className="text-3xl font-bold text-gray-800">20</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-[#29AAE1]" />
            </div>
            <span className="text-red-500 text-xs font-bold flex items-center">
              ↓ 15%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Upcoming Consultations</p>
          <p className="text-3xl font-bold text-gray-800">25</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 overflow-hidden">
        <CustomTable
          columns={columns}
          data={filteredTeleconsultations}
          isLoading={loading}
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default TeleconsultationPage;
