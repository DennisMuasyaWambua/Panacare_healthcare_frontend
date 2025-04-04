"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

const sampleData1 = [
  { name: "Jan", value: 10000 },
  { name: "Feb", value: 15000 },
  { name: "Mar", value: 12000 },
  { name: "Apr", value: 18000 },
  { name: "May", value: 20000 },
  { name: "Jun", value: 22000 },
  { name: "Jul", value: 25000 },
  { name: "Aug", value: 23000 },
  { name: "Sep", value: 24000 },
  { name: "Oct", value: 26000 },
  { name: "Nov", value: 28000 },
  { name: "Dec", value: 30000 },
];

const sampleData2 = [
  { name: "Jan", active: 20000, inactive: 5000 },
  { name: "Feb", active: 22000, inactive: 4000 },
  { name: "Mar", active: 21000, inactive: 4500 },
  { name: "Apr", active: 23000, inactive: 4000 },
  { name: "May", active: 25000, inactive: 3500 },
  { name: "Jun", active: 27000, inactive: 3000 },
  { name: "Jul", active: 29000, inactive: 2500 },
  { name: "Aug", active: 28000, inactive: 3000 },
  { name: "Sep", active: 30000, inactive: 2000 },
  { name: "Oct", active: 32000, inactive: 1500 },
  { name: "Nov", active: 34000, inactive: 1000 },
  { name: "Dec", active: 36000, inactive: 500 },
];

const Dashboard = () => {
  return (
    <div className="p-6 px-6 bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center bg-white shadow-sm rounded-lg px-4 py-2">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search an item"
            className="ml-2 w-[369px] border-none focus:outline-none text-gray-600"
          />
        </div>
      </div>

      {/* Patients Section */}
      <h1 className="text-2xl font-bold text-[#29AAE1] mb-6">Patients</h1>
      <Section
        title="Patients"
        firstCard={[
          { label: "Registered Patients", value: "948,558", trend: "up" },
          { label: "Average Monthly Patients", value: "79,046", trend: "up" },
        ]}
        secondCard={[
          { label: "Total Active Patients", value: "200,558", trend: "up" },
          { label: "Total Inactive Patients", value: "16,558", trend: "down" },
        ]}
        charts={[
          {
            title: "Average Monthly Patients",
            data: sampleData1,
            dataKey: "value",
          },
          {
            title: "Active Patients vs Inactive Patients",
            data: sampleData2,
            lines: [
              { dataKey: "active", color: "#38a169" },
              { dataKey: "inactive", color: "#e53e3e" },
            ],
          },
        ]}
      />

      {/* Doctors Section */}
      <h1 className="text-2xl font-bold text-[#29AAE1] mb-6">Doctors</h1>
      <Section
        title="Doctors"
        firstCard={[
          { label: "Registered Doctors", value: "12,345", trend: "up" },
          { label: "Average Monthly Doctors", value: "1,234", trend: "up" },
        ]}
        secondCard={[
          { label: "Total Active Doctors", value: "10,123", trend: "up" },
          { label: "Total Inactive Doctors", value: "2,222", trend: "down" },
        ]}
        charts={[
          {
            title: "Average Monthly Doctors",
            data: sampleData1,
            dataKey: "value",
          },
          {
            title: "Active Doctors vs Inactive Doctors",
            data: sampleData2,
            lines: [
              { dataKey: "active", color: "#38a169" },
              { dataKey: "inactive", color: "#e53e3e" },
            ],
          },
        ]}
      />

      {/* Hospitals Section */}
      <h1 className="text-2xl font-bold text-[#29AAE1] mb-6">Hospitals</h1>
      <Section
        title="Hospitals"
        firstCard={[
          { label: "Registered Facilities", value: "5,678", trend: "up" },
          { label: "Average Monthly Facilities", value: "567", trend: "up" },
        ]}
        secondCard={[
          { label: "Total Active Facilities", value: "4,890", trend: "up" },
          { label: "Total Inactive Facilities", value: "788", trend: "down" },
        ]}
        charts={[
          {
            title: "Average Monthly Facilities",
            data: sampleData1,
            dataKey: "value",
          },
          {
            title: "Active Facilities vs Inactive Facilities",
            data: sampleData2,
            lines: [
              { dataKey: "active", color: "#38a169" },
              { dataKey: "inactive", color: "#e53e3e" },
            ],
          },
        ]}
      />

      {/* Subscriptions Section */}
      <h1 className="text-2xl font-bold text-[#29AAE1] mb-6">
        Number of Subscriptions
      </h1>
      <Section
        title="Subscriptions"
        firstCard={[
          { label: "Basic Package", value: "1,234", trend: "up" },
          { label: "Bronze Package", value: "567", trend: "up" },
        ]}
        secondCard={[
          { label: "Silver Package", value: "890", trend: "up" },
          { label: "Gold Package", value: "345", trend: "up" },
        ]}
        charts={[]}
      />
    </div>
  );
};

const Section = ({ title, firstCard, secondCard, charts }) => (
  <div className="mb-12">
    {/* Statistics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* First Combined Card */}
      <Card items={firstCard} />
      {/* Second Combined Card */}
      <Card items={secondCard} />
    </div>

    {/* Charts Section */}
    {charts.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <Chart
            key={index}
            title={chart.title}
            data={chart.data}
            lines={chart.lines}
            dataKey={chart.dataKey}
          />
        ))}
      </div>
    )}
  </div>
);

const Card = ({ items }) => (
  <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <div className="flex-1">
          <h2 className="text-gray-500 text-sm mb-2">{item.label}</h2>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-[#7F375E]">
              {item.value}
            </span>
            {item.trend === "up" ? (
              <ChevronUp className="ml-2 text-green-500" size={20} />
            ) : (
              <ChevronDown className="ml-2 text-red-500" size={20} />
            )}
          </div>
        </div>
        {index < items.length - 1 && (
          <div className="w-[2px] h-full bg-[#707070] mx-4"></div>
        )}
      </React.Fragment>
    ))}
  </div>
);

const Chart = ({ title, data, lines, dataKey }) => (
  <div className="bg-white shadow-sm rounded-lg p-4">
    <h2 className="text-[#7F375E] text-sm mb-4">{title}</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          {lines ? (
            lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3182ce"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Dashboard;
