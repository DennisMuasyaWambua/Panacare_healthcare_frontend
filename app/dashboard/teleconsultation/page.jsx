"use client";

import React, { useState, useEffect } from "react";
import { Search, Video, Phone, Calendar, Clock, User, Monitor, Filter } from "lucide-react";

const TeleconsultationPage = () => {
  const [teleconsultations, setTeleconsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Teleconsultations</h1>
        <p className="text-gray-600">Manage virtual consultations and video calls</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search teleconsultations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29AAE1] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29AAE1] focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 bg-[#29AAE1] text-white rounded-lg hover:bg-blue-600 transition duration-200">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-[#29AAE1]" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Scheduled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teleconsultations.filter(t => t.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Monitor className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teleconsultations.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Video className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teleconsultations.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Phone className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teleconsultations.filter(t => t.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teleconsultations List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center items-center">
            <div className="text-[#29AAE1] text-lg">Loading teleconsultations...</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredTeleconsultations.length === 0 ? (
            <div className="p-8 text-center">
              <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teleconsultations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeleconsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-[#29AAE1] flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {consultation.patientName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.doctorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {consultation.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {consultation.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(consultation.type)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {consultation.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.platform}</div>
                        <div className="text-xs text-gray-500">ID: {consultation.sessionId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                          {consultation.status.replace('-', ' ').charAt(0).toUpperCase() + consultation.status.replace('-', ' ').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {consultation.status === 'scheduled' && (
                          <button className="text-green-600 hover:text-green-800 mr-3">
                            Join
                          </button>
                        )}
                        <button className="text-[#29AAE1] hover:text-blue-600 mr-3">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 mr-3">
                          Edit
                        </button>
                        {consultation.status === 'scheduled' && (
                          <button className="text-red-600 hover:text-red-800">
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeleconsultationPage;
