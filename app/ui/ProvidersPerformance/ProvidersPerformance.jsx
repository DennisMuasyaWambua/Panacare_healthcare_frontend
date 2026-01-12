"use client";
import React, { useState } from "react";
import { Search, ChevronDown, Star, ArrowUp, ArrowDown, Users, Calendar, UserPlus, ThumbsUp } from "lucide-react";

const ProvidersPerformance = () => {
    const [clinicFilter, setClinicFilter] = useState("Filter by Clinic");
    const [consultationFilter, setConsultationFilter] = useState("Filter by Consultation Type");
    const [feedbackSearch, setFeedbackSearch] = useState("");
    const [insightsSearch, setInsightsSearch] = useState("");

    const stats = [
        {
            label: "Average Rating",
            value: "4.5",
            trend: "10%",
            trendType: "up",
            icon: (
                <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5">
                        <Star size={10} fill="#9CA3AF" className="text-gray-400" />
                        <Star size={10} fill="#9CA3AF" className="text-gray-400" />
                        <Star size={10} fill="#9CA3AF" className="text-gray-400" />
                    </div>
                    <ThumbsUp size={24} className="text-gray-400" />
                </div>
            ),
        },
        {
            label: "Total Reviews",
            value: "45",
            trend: "65%",
            trendType: "up",
            icon: <Users size={24} className="text-gray-400 mt-2" />
        },
        {
            label: "Missed Appointments",
            value: "20",
            trend: "15%",
            trendType: "down",
            icon: <Calendar size={24} className="text-gray-400 mt-2" />
        },
        {
            label: "Upcoming Appointments",
            value: "25",
            trend: "15%",
            trendType: "down",
            icon: <UserPlus size={24} className="text-gray-400 mt-2" />
        }
    ];

    const feedbackData = [
        { name: "Dr. Jane Munene", rating: 4.8, ratingsCount: 45, feedback: "Extremely Attentive To Detail" },
        { name: "Dr. Jane Munene", rating: 4.8, ratingsCount: 45, feedback: "Extremely Attentive To Detail" },
        { name: "Dr. Jane Munene", rating: 4.8, ratingsCount: 45, feedback: "Extremely Attentive To Detail" },
    ];

    const insightsData = [
        { name: "Dr. Jane Munene", consultTime: "12 Minutes", responseTime: "2 Hours", missedPct: "4%", completed: "45 Sessions" },
        { name: "Dr. Singh Kandhar", consultTime: "17 Minutes", responseTime: "1.7 Hours", missedPct: "2%", completed: "39 Sessions" },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl font-semibold text-[#7F375E]">Provider Feedback & Performance</h1>
                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29AAE1]/20 min-w-[180px] shadow-sm"
                            value={clinicFilter}
                            onChange={(e) => setClinicFilter(e.target.value)}
                        >
                            <option>Filter by Clinic</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                    </div>
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29AAE1]/20 min-w-[220px] shadow-sm"
                            value={consultationFilter}
                            onChange={(e) => setConsultationFilter(e.target.value)}
                        >
                            <option>Filter by Consultation Type</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-1 rounded-lg">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trendType === 'up' ? <ArrowUp size={16} strokeWidth={3} /> : <ArrowDown size={16} strokeWidth={3} />}
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Provider Feedback & Performance Table */}
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Provider Feedback & Performance</h2>
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder="Search by Doctor Name"
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#29AAE1]/20 shadow-sm transition-all"
                            value={feedbackSearch}
                            onChange={(e) => setFeedbackSearch(e.target.value)}
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800">Doctor/Clinic</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800 text-center">Avg Rating</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800 text-center">No. Of Ratings</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800">Last Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {feedbackData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 text-sm text-gray-600 font-medium">{row.name}</td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Star size={16} className="text-yellow-400" fill="currentColor" />
                                                <span className="text-sm font-bold text-gray-700">{row.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center text-sm text-gray-600 font-medium">{row.ratingsCount}</td>
                                        <td className="px-8 py-5 text-sm text-gray-600 font-medium">{row.feedback}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-8 py-4 border-t border-gray-50 bg-gray-50/10 h-10"></div>
                </div>
            </div>

            {/* Provider Insights Table */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Provider Insights Table</h2>
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder="Search by Doctor Name"
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#29AAE1]/20 shadow-sm transition-all"
                            value={insightsSearch}
                            onChange={(e) => setInsightsSearch(e.target.value)}
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800">Doctor/Clinic</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800 text-center">Avg Consult Time</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800 text-center">Response Time</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800 text-center">Missed %</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-800 text-center">Completed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {insightsData.map((row, i) => (
                                    <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                                        <td className="px-8 py-5 text-sm text-gray-600 font-medium">{row.name}</td>
                                        <td className="px-8 py-5 text-center text-sm text-gray-600 font-medium">{row.consultTime}</td>
                                        <td className="px-8 py-5 text-center text-sm text-gray-600 font-medium">{row.responseTime}</td>
                                        <td className="px-8 py-5 text-center text-sm text-gray-600 font-medium">{row.missedPct}</td>
                                        <td className="px-8 py-5 text-center text-sm text-gray-600 font-medium">{row.completed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-8 py-4 border-t border-gray-50 bg-gray-50/10 h-10"></div>
                </div>
            </div>
        </div>
    );
};

export default ProvidersPerformance;
