"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronUp,
  ChevronDown,
  Search,
  UserPlus,
  Users,
  Activity,
  UserX,
  Stethoscope,
  Building,
  Calendar,
  Minimize2,
  Maximize2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  doctorsAPI,
  patientsAPI,
  healthcareFacilitiesAPI,
  packagesAPI
} from "../utils/api";

// Helper function to format numbers with commas
const formatNumber = (num) => {
  return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
};

// Generate monthly data for charts based on total count
const generateMonthlyData = (totalCount, trend = "increasing") => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Current month for highlighting in charts (September in the design)
  const currentMonth = "Sep";

  // Base value is roughly 1/12 of total with some variation
  const baseMonthly = Math.max(1, Math.floor(totalCount / 12));

  return months.map((name, index) => {
    // Adjust monthly value based on trend and add some randomness
    let multiplier;
    if (trend === "increasing") {
      // Gradually increase throughout the year
      multiplier = 0.7 + (index * 0.05) + (Math.random() * 0.1);
    } else {
      // Random fluctuation around the mean
      multiplier = 0.8 + (Math.random() * 0.4);
    }

    return {
      name,
      value: Math.floor(baseMonthly * multiplier),
      isCurrent: name === currentMonth // Mark current month for reference line
    };
  });
};

// Generate active vs inactive data for charts
const generateActiveInactiveData = (totalActive, totalInactive) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Current month for highlighting in charts (September in the design)
  const currentMonth = "Sep";

  // Base values
  const baseActive = Math.max(1, Math.floor(totalActive / 12));
  const baseInactive = Math.max(1, Math.floor(totalInactive / 12));

  return months.map((name, index) => {
    // Active tends to increase, inactive tends to decrease over time
    const activeMultiplier = 0.7 + (index * 0.05) + (Math.random() * 0.1);
    const inactiveMultiplier = 1.1 - (index * 0.05) + (Math.random() * 0.1);

    return {
      name,
      active: Math.floor(baseActive * activeMultiplier),
      inactive: Math.floor(baseInactive * inactiveMultiplier),
      isCurrent: name === currentMonth // Mark current month for reference line
    };
  });
};

const Dashboard = () => {
  // State for all dashboard data
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  // Collapsed sections state
  const [collapsedSections, setCollapsedSections] = useState({
    patients: false,
    doctors: false,
    hospitals: false,
  });

  // Toggle section visibility
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Data states
  const [patientData, setPatientData] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    monthlyAvg: 0,
    monthlyData: [],
    activeInactiveData: []
  });

  const [doctorData, setDoctorData] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    monthlyAvg: 0,
    monthlyData: [],
    activeInactiveData: []
  });

  const [facilityData, setFacilityData] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    monthlyAvg: 0,
    monthlyData: [],
    activeInactiveData: []
  });

  const [packageData, setPackageData] = useState({
    packages: [],
    packageCounts: {}
  });

  // Load all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [patients, doctors, facilities, packages] = await Promise.all([
          patientsAPI.getAllPatients(),
          doctorsAPI.getAllDoctors(),
          healthcareFacilitiesAPI.getAllFacilities(),
          packagesAPI.getAllPackages()
        ]);

        // Process patients data
        if (patients && patients.length > 0) {
          const total = patients.length;
          const active = patients.filter(p => p.is_active).length;
          const inactive = total - active;
          const monthlyAvg = Math.round(total / 12);

          setPatientData({
            total,
            active,
            inactive,
            monthlyAvg,
            monthlyData: generateMonthlyData(total),
            activeInactiveData: generateActiveInactiveData(active, inactive)
          });
        }

        // Process doctors data
        if (doctors && doctors.length > 0) {
          const total = doctors.length;
          const active = doctors.filter(d => d.is_active).length;
          const inactive = total - active;
          const verified = doctors.filter(d => d.is_verified).length;
          const unverified = total - verified;
          const monthlyAvg = Math.round(total / 12);

          setDoctorData({
            total,
            active,
            inactive,
            verified,
            unverified,
            monthlyAvg,
            monthlyData: generateMonthlyData(total),
            activeInactiveData: generateActiveInactiveData(active, inactive)
          });
        }

        // Process facilities data
        if (facilities && facilities.length > 0) {
          const total = facilities.length;
          const active = facilities.filter(f => f.is_active).length;
          const inactive = total - active;
          const monthlyAvg = Math.round(total / 12);

          setFacilityData({
            total,
            active,
            inactive,
            monthlyAvg,
            monthlyData: generateMonthlyData(total),
            activeInactiveData: generateActiveInactiveData(active, inactive)
          });
        }

        // Process packages data
        if (packages && packages.length > 0) {
          // Group packages by type and count
          const packageCounts = {};

          packages.forEach(pkg => {
            const type = pkg.package_type || "Unknown";
            packageCounts[type] = (packageCounts[type] || 0) + 1;
          });

          setPackageData({
            packages,
            packageCounts
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="p-6 px-8 bg-gray-50 min-h-screen overflow-y-auto">

      {/* Dashboard Header with Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-lg">👋</span>
          <p className="text-gray-600">
            Welcome Back, <span className="text-[#7F375E] font-medium">{user?.first_name || user?.name || 'John'}</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-[#29AAE1] text-lg">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          {/* Patients Section */}
          <Section
            id="patients"
            title="Patients"
            isCollapsed={collapsedSections.patients}
            onToggle={() => toggleSection('patients')}
            firstCard={[
              { label: "Registered Patients", value: formatNumber(patientData.total), trend: "up", icon: UserPlus, iconColor: "text-[#7F375E]" },
              { label: "Average Monthly Patients", value: formatNumber(patientData.monthlyAvg), trend: "up", icon: Users, iconColor: "text-[#29AAE1]" },
            ]}
            secondCard={[
              { label: "Total Active Patients", value: formatNumber(patientData.active), trend: "down", icon: Activity, iconColor: "text-[#7F375E]" },
              { label: "Total Inactive Patients", value: formatNumber(patientData.inactive), trend: "down", icon: UserX, iconColor: "text-[#29AAE1]" },
            ]}
            charts={[
              {
                title: "Average Monthly Patients",
                data: patientData.monthlyData,
                dataKey: "value",
              },
              {
                title: "Active Patients vs Inactive Patients",
                data: patientData.activeInactiveData,
                lines: [
                  { dataKey: "active", color: "#38a169" }, // Green
                  { dataKey: "inactive", color: "#e53e3e" }, // Red
                ],
              },
            ]}
          />

          {/* Doctors Section */}
          <Section
            id="doctors"
            title="Doctors"
            isCollapsed={collapsedSections.doctors}
            onToggle={() => toggleSection('doctors')}
            firstCard={[
              { label: "Registered Doctors", value: formatNumber(doctorData.total), trend: "up", icon: Stethoscope, iconColor: "text-[#7F375E]" },
              { label: "Average Monthly Doctors", value: formatNumber(doctorData.monthlyAvg), trend: "up", icon: Users, iconColor: "text-[#29AAE1]" },
            ]}
            secondCard={[
              { label: "Total Active Doctors", value: formatNumber(doctorData.active), trend: "down", icon: Activity, iconColor: "text-[#7F375E]" },
              { label: "Total Inactive Doctors", value: formatNumber(doctorData.inactive), trend: "down", icon: UserX, iconColor: "text-[#29AAE1]" },
            ]}
            charts={[
              {
                title: "Average Monthly Doctors",
                data: doctorData.monthlyData,
                dataKey: "value",
              },
              {
                title: "Active Doctors vs Inactive Doctors",
                data: doctorData.activeInactiveData,
                lines: [
                  { dataKey: "active", color: "#38a169" },
                  { dataKey: "inactive", color: "#e53e3e" },
                ],
              },
            ]}
          />

          {/* Hospitals Section */}
          <Section
            id="hospitals"
            title="Hospitals"
            isCollapsed={collapsedSections.hospitals}
            onToggle={() => toggleSection('hospitals')}
            firstCard={[
              { label: "Registered Facilities", value: formatNumber(facilityData.total), trend: "down", icon: Building, iconColor: "text-[#7F375E]" },
              { label: "Average Monthly Facilities", value: formatNumber(facilityData.monthlyAvg), trend: "down", icon: Building, iconColor: "text-[#29AAE1]" },
            ]}
            secondCard={[
              { label: "Total Active Facilities", value: formatNumber(facilityData.active), trend: "down", icon: Activity, iconColor: "text-[#7F375E]" },
              { label: "Total Inactive Facilities", value: formatNumber(facilityData.inactive), trend: "down", icon: Building, iconColor: "text-[#29AAE1]" },
            ]}
            charts={[
              {
                title: "Average Monthly Facilities",
                data: facilityData.monthlyData,
                dataKey: "value",
              },
              {
                title: "Active Facilities vs Inactive Facilities",
                data: facilityData.activeInactiveData,
                lines: [
                  { dataKey: "active", color: "#38a169" },
                  { dataKey: "inactive", color: "#e53e3e" },
                ],
              },
            ]}
          />
        </>
      )}

    </div>
  );
};

const Section = ({ id, title, isCollapsed, onToggle, firstCard, secondCard, charts }) => (
  <div className="mb-8 border-b border-gray-200 pb-8 last:border-b-0">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-medium text-gray-800">{title}</h1>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        {isCollapsed ? (
          <>
            <Maximize2 size={16} />
            <span>Expand</span>
          </>
        ) : (
          <>
            <Minimize2 size={16} />
            <span>Collapse</span>
          </>
        )}
      </button>
    </div>

    {!isCollapsed && (
      <>
        {/* Statistics Cards - 4 individual cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Combine both card arrays into individual cards */}
          {[...firstCard, ...secondCard].map((item, index) => (
            <SingleCard key={index} item={item} />
          ))}
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
      </>
    )}
  </div>
);

const SingleCard = ({ item }) => {
  const Icon = item.icon || Activity;
  return (
    <div className="bg-white shadow-sm rounded-xl p-5">
      {/* Top row: Icon and Percentage */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.iconColor === 'text-[#7F375E]' ? 'bg-purple-50' : 'bg-blue-50'
          }`}>
          <Icon className={`w-6 h-6 ${item.iconColor || "text-gray-500"}`} />
        </div>
        <div className="flex items-center gap-1">
          {item.trend === "up" ? (
            <>
              <ChevronUp className="text-green-500 w-4 h-4" strokeWidth={3} />
              <span className="text-green-500 text-sm font-semibold">65%</span>
            </>
          ) : (
            <>
              <ChevronDown className="text-red-500 w-4 h-4" strokeWidth={3} />
              <span className="text-red-500 text-sm font-semibold">15%</span>
            </>
          )}
        </div>
      </div>

      {/* Label */}
      <p className="text-gray-600 text-sm mb-2">{item.label}</p>

      {/* Value */}
      <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>
    </div>
  );
};

const Card = ({ items }) => (
  <div className="bg-white shadow-sm rounded-xl p-6 flex gap-4">
    {items.map((item, index) => {
      const Icon = item.icon || Activity;
      return (
        <React.Fragment key={index}>
          <div className="flex-1">
            {/* Top row: Icon and Percentage */}
            <div className="flex justify-between items-start mb-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.iconColor === 'text-[#7F375E]' ? 'bg-purple-50' : 'bg-blue-50'
                }`}>
                <Icon className={`w-6 h-6 ${item.iconColor || "text-gray-500"}`} />
              </div>
              <div className="flex items-center gap-1">
                {item.trend === "up" ? (
                  <>
                    <ChevronUp className="text-green-500 w-4 h-4" strokeWidth={3} />
                    <span className="text-green-500 text-sm font-semibold">65%</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="text-red-500 w-4 h-4" strokeWidth={3} />
                    <span className="text-red-500 text-sm font-semibold">15%</span>
                  </>
                )}
              </div>
            </div>

            {/* Label */}
            <p className="text-gray-600 text-sm mb-2">{item.label}</p>

            {/* Value */}
            <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>
          </div>
          {index < items.length - 1 && (
            <div className="w-px bg-gray-200"></div>
          )}
        </React.Fragment>

      );
    })}
  </div>
);

const Chart = ({ title, data, lines, dataKey }) => {
  // Find the current month data point
  const currentMonth = data.find(d => d.isCurrent);
  let currentMonthIndex = -1;

  if (currentMonth) {
    currentMonthIndex = data.findIndex(d => d.isCurrent);
  }

  const currentMonth3Letter = "Sep"; // September used in the design
  const currentYear = "2024"; // Current year from design

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-xs">
          <p className="font-bold mb-1 text-gray-800">September, 2024</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-semibold text-gray-700">{entry.value}</span>
              <span className="text-gray-500 capitalize">{entry.name === "value" ? "Total Patients" : entry.name.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[#7F375E] text-sm font-medium">{title}</h2>
        {/* Legend */}
        {lines ? (
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            {lines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color }}></div>
                <span className="capitalize">{line.dataKey === "value" ? "Total" : line.dataKey.replace(/([A-Z])/g, ' $1').trim()} Patients</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <div className="w-2 h-2 rounded-full bg-[#29AAE1]"></div>
            <span>Total Patients</span>
          </div>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="0" vertical={true} horizontal={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Reference Line for Current Month */}
            {currentMonthIndex >= 0 && (
              <svg>
                <line
                  x1={`${(currentMonthIndex / (data.length - 1)) * 100}%`}
                  y1="0%"
                  x2={`${(currentMonthIndex / (data.length - 1)) * 100}%`}
                  y2="100%"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
              </svg>
            )}

            {lines ? (
              lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: line.color }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#29AAE1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#29AAE1' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
