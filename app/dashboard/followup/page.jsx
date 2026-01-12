"use client";

import React, { useState, useEffect } from "react";
import { Search, AlertTriangle, CheckCircle, Clock, User, Calendar, Filter, TrendingUp, TrendingDown } from "lucide-react";

const FollowUpCompliancePage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompliance, setFilterCompliance] = useState("all");

  // Sample follow-up compliance data - you can replace this with API calls later
  useEffect(() => {
    const fetchFollowUps = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleFollowUps = [
          {
            id: 1,
            patientName: "John Doe",
            doctorName: "Dr. Sarah Wilson",
            initialVisit: "2024-08-15",
            followUpDue: "2024-08-29",
            followUpType: "Check-up",
            status: "compliant",
            daysOverdue: 0,
            lastContact: "2024-08-28",
            priority: "medium"
          },
          {
            id: 2,
            patientName: "Jane Smith",
            doctorName: "Dr. Michael Brown",
            initialVisit: "2024-08-10",
            followUpDue: "2024-08-24",
            followUpType: "Blood Test Review",
            status: "overdue",
            daysOverdue: 5,
            lastContact: "2024-08-20",
            priority: "high"
          },
          {
            id: 3,
            patientName: "Robert Johnson",
            doctorName: "Dr. Emily Davis",
            initialVisit: "2024-08-20",
            followUpDue: "2024-09-03",
            followUpType: "Medication Review",
            status: "upcoming",
            daysOverdue: 0,
            lastContact: "2024-08-20",
            priority: "low"
          },
          {
            id: 4,
            patientName: "Maria Garcia",
            doctorName: "Dr. James Anderson",
            initialVisit: "2024-08-05",
            followUpDue: "2024-08-19",
            followUpType: "Surgery Follow-up",
            status: "overdue",
            daysOverdue: 10,
            lastContact: "2024-08-15",
            priority: "high"
          },
          {
            id: 5,
            patientName: "David Wilson",
            doctorName: "Dr. Sarah Wilson",
            initialVisit: "2024-08-22",
            followUpDue: "2024-08-29",
            followUpType: "Consultation",
            status: "compliant",
            daysOverdue: 0,
            lastContact: "2024-08-29",
            priority: "medium"
          }
        ];
        
        setFollowUps(sampleFollowUps);
      } catch (error) {
        console.error("Error fetching follow-ups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = 
      followUp.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.followUpType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCompliance === "all" || followUp.status === filterCompliance;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate compliance metrics
  const totalFollowUps = followUps.length;
  const compliantCount = followUps.filter(f => f.status === 'compliant').length;
  const overdueCount = followUps.filter(f => f.status === 'overdue').length;
  const upcomingCount = followUps.filter(f => f.status === 'upcoming').length;
  const complianceRate = totalFollowUps > 0 ? Math.round((compliantCount / totalFollowUps) * 100) : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Follow-Up Compliance Monitor</h1>
        <p className="text-gray-600">Track patient follow-up appointments and compliance rates</p>
      </div>

      {/* Compliance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-[#29AAE1]" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{complianceRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Compliant</p>
              <p className="text-2xl font-semibold text-gray-900">{compliantCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">{overdueCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{totalFollowUps}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search follow-ups..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29AAE1] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29AAE1] focus:border-transparent"
              value={filterCompliance}
              onChange={(e) => setFilterCompliance(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <button className="px-4 py-2 bg-[#29AAE1] text-white rounded-lg hover:bg-blue-600 transition duration-200">
              Send Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Follow-ups List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center items-center">
            <div className="text-[#29AAE1] text-lg">Loading follow-up data...</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredFollowUps.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No follow-ups found</h3>
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
                      Follow-up Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Overdue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
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
                  {filteredFollowUps.map((followUp) => (
                    <tr key={followUp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-[#29AAE1] flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {followUp.patientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Initial: {followUp.initialVisit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{followUp.doctorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{followUp.followUpType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {followUp.followUpDue}
                        </div>
                        <div className="text-sm text-gray-500">
                          Last contact: {followUp.lastContact}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {followUp.daysOverdue > 0 ? (
                            <span className="text-red-600 font-medium">
                              {followUp.daysOverdue} days
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(followUp.priority)}`}>
                          {followUp.priority.charAt(0).toUpperCase() + followUp.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(followUp.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(followUp.status)}`}>
                            {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-[#29AAE1] hover:text-blue-600 mr-3">
                          Contact
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 mr-3">
                          Reschedule
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          Mark Complete
                        </button>
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

export default FollowUpCompliancePage;
