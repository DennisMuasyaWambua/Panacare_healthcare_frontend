"use client";
import React, { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Download, ChevronDown } from "lucide-react";

const data = [
  { name: "Moderate", value: 210, color: "#6366F1" }, 
  { name: "High", value: 98, color: "#EC4899" }, 
  { name: "Severe", value: 142, color: "#8B5CF6" },
];

const Risksegmentation = () => {
  const [county, setCounty] = useState("HomaBay");
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2025-01-30");

  const totalPatients = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold text-[#1B1B1B] mb-6">
        Risk Segmentation
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-start border-b pb-4 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Filter by County
            </label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="px-4 py-2 border rounded-md bg-gray-50 text-gray-800 w-48 cursor-pointer"
            >
              <option value="HomaBay">HomaBay</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Nairobi">Nairobi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Filter by Date Range
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-4 py-2 border rounded-md bg-gray-50 text-gray-800 cursor-pointer"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-4 py-2 border rounded-md bg-gray-50 text-gray-800 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-gray-700 flex items-center gap-2 cursor-pointer">
          <Download size={16} /> Export pdf
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-gray-700">
            Patient Distribution by Risk Level
          </h2>
          <button className="flex items-center gap-1 px-3 py-1 border rounded-md bg-gray-50 text-gray-600 text-sm hover:bg-gray-100 cursor-pointer">
            This Week <ChevronDown size={14} />
          </button>
        </div>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="middle" align="right" layout="vertical" />
          </PieChart>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-gray-700">
            Risk Levels Summary
          </h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-100 text-gray-700 cursor-pointer">
              <Download size={16} /> Export pdf
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-100 text-gray-700 cursor-pointer">
              <Download size={16} /> Export csv
            </button>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#F9F9F9", color: "#7F375E" }}>
              <th className="p-3 text-left font-semibold">Risk Level</th>
              <th className="p-3 text-left font-semibold">Number of Patients</th>
              <th className="p-3 text-left font-semibold">% of Total</th>
              <th className="p-3 text-left font-semibold">View Patients</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t" style={{ color: "#7A7A7A" }}>
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.value}</td>
                <td className="p-3">
                  {((row.value / totalPatients) * 100).toFixed(1)}%
                </td>
                <td className="p-3 text-blue-600 cursor-pointer">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Risksegmentation;
