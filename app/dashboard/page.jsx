"use client";

import React, { useState, useEffect } from "react";

import {LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

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
  const {user} = useAuth();
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
  
  // Prepare subscription data for the UI
  const packageTypes = Object.keys(packageData.packageCounts);
  const firstPackageCard = packageTypes.slice(0, 2).map(type => ({
    label: `${type} Package`,
    value: formatNumber(packageData.packageCounts[type] || 0),
    trend: "up"
  }));
  
  const secondPackageCard = packageTypes.slice(2, 4).map(type => ({
    label: `${type} Package`,
    value: formatNumber(packageData.packageCounts[type] || 0),
    trend: "up"
  }));
  
  // If we have fewer than 4 package types, add placeholder data
  if (firstPackageCard.length < 2) {
    const missingCount = 2 - firstPackageCard.length;
    for (let i = 0; i < missingCount; i++) {
      firstPackageCard.push({
        label: `Package ${firstPackageCard.length + 1}`,
        value: "0",
        trend: "up"
      });
    }
  }
  
  if (secondPackageCard.length < 2) {
    const missingCount = 2 - secondPackageCard.length;
    for (let i = 0; i < missingCount; i++) {
      secondPackageCard.push({
        label: `Package ${firstPackageCard.length + secondPackageCard.length + 1}`,
        value: "0",
        trend: "up"
      });
    }
  }
  

  return (


    
    <div className="p-6 px-6 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="w-32 h-8 relative">
  <div className="left-0 top-0 absolute justify-start text-fuchsia-900 text-xl font-normal font-['Poppins']">Dashboard</div></div>
  <div className="w-80 h-7 justify-start text-stone-900 text-lg font-bold font-['Poppins'] leading-normal">👋🏾 Welcome Back,  {user ? `${user.first_name}` : 'User'} </div>

   {/* User profile information  */}
  <div className="inline-flex justify-end items-center gap-6">
    <div className="absolute top-0 right-0 m-4 inline-flex justify-end items-center gap-6">
      <div className="w-8 h-8 relative overflow-hidden">
        <div className="w-5 h-7 left-[5.50px] top-[2.25px] absolute bg-gray-700" />
      </div>
      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
      <div className="justify-start text-sky-500 text-base font-normal font-['Poppins']">{user.first_name}</div>
      <div className="justify-start text-sky-500 text-base font-normal font-['Poppins']">{user.last_name}</div>
    </div>
  
  </div>

      {/* Search Bar */}
      <div className="w-32 h-8 relative">
       
      </div>
      <div className="mb-6">
        <div className="flex items-center bg-white shadow-sm rounded-lg px-4 py-2">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search an item"
            className="ml-2 w-[369px] border-none focus:outline-none text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>



      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-[#29AAE1] text-lg">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          {/* Patients Section */}
          <h1 className="text-xl font-medium text-gray-700 mb-4">Patients</h1>
          <Section
            title="Patients"
            firstCard={[
              { label: "Registered Patients", value: formatNumber(patientData.total), trend: "up" },
              { label: "Average Monthly Patients", value: formatNumber(patientData.monthlyAvg), trend: "up" },
            ]}
            secondCard={[
              { label: "Total Active Patients", value: formatNumber(patientData.active), trend: "up" },
              { label: "Total Inactive Patients", value: formatNumber(patientData.inactive), trend: patientData.inactive > 0 ? "down" : "up" },
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
                  { dataKey: "active", color: "#38a169" },
                  { dataKey: "inactive", color: "#e53e3e" },
                ],
              },
            ]}
          />

          {/* Doctors Section */}
          <h1 className="text-xl font-medium text-gray-700 mb-4">Doctors</h1>
          <Section
            title="Doctors"
            firstCard={[
              { label: "Registered Doctors", value: formatNumber(doctorData.total), trend: "up" },
              { label: "Average Monthly Doctors", value: formatNumber(doctorData.monthlyAvg), trend: "up" },
            ]}
            secondCard={[
              { label: "Total Active Doctors", value: formatNumber(doctorData.active), trend: "up" },
              { label: "Total Inactive Doctors", value: formatNumber(doctorData.inactive), trend: doctorData.inactive > 0 ? "down" : "up" },
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
          <h1 className="text-xl font-medium text-gray-700 mb-4">Hospitals</h1>
          <Section
            title="Hospitals"
            firstCard={[
              { label: "Registered Facilities", value: formatNumber(facilityData.total), trend: "up" },
              { label: "Average Monthly Facilities", value: formatNumber(facilityData.monthlyAvg), trend: "up" },
            ]}
            secondCard={[
              { label: "Total Active Facilities", value: formatNumber(facilityData.active), trend: "up" },
              { label: "Total Inactive Facilities", value: formatNumber(facilityData.inactive), trend: facilityData.inactive > 0 ? "down" : "up" },
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

          {/* Subscriptions Section */}
          <h1 className="text-xl font-medium text-gray-700 mb-4">
            Number of Subscriptions
          </h1>
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Card */}
              <div className="bg-white shadow-sm rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h2 className="text-gray-500 text-sm mb-2">{firstPackageCard[0]?.label || "Basic Package"}</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-[#7F375E]">
                        {firstPackageCard[0]?.value || "0"}
                      </span>
                      <ChevronUp className="ml-2 text-green-500" size={20} />
                    </div>
                  </div>
                  <div className="w-[1px] h-16 bg-gray-300 mx-4"></div>
                  <div className="flex-1">
                    <h2 className="text-gray-500 text-sm mb-2">{secondPackageCard[0]?.label || "Silver Package"}</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-[#7F375E]">
                        {secondPackageCard[0]?.value || "0"}
                      </span>
                      <ChevronUp className="ml-2 text-green-500" size={20} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Second Card */}
              <div className="bg-white shadow-sm rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h2 className="text-gray-500 text-sm mb-2">{firstPackageCard[1]?.label || "Bronze Package"}</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-[#7F375E]">
                        {firstPackageCard[1]?.value || "0"}
                      </span>
                      <ChevronUp className="ml-2 text-green-500" size={20} />
                    </div>
                  </div>
                  <div className="w-[1px] h-16 bg-gray-300 mx-4"></div>
                  <div className="flex-1">
                    <h2 className="text-gray-500 text-sm mb-2">{secondPackageCard[1]?.label || "Gold Package"}</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-[#7F375E]">
                        {secondPackageCard[1]?.value || "0"}
                      </span>
                      <ChevronUp className="ml-2 text-green-500" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

const Section = ({ title, firstCard, secondCard, charts }) => (
  <div className="mb-14">
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
          <div className="w-[1px] h-16 bg-gray-300 mx-4"></div>
        )}
      </React.Fragment>
    ))}
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
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-gray-600 text-sm font-medium">{title}</h2>
        <div className="flex items-center text-xs text-gray-500">
          <div className="px-2 py-1 bg-gray-100 rounded-md">
            {currentMonth3Letter}, {currentYear}
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fontSize: 10 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
                border: 'none'
              }}
            />
            {/* Reference Line for Current Month */}
            {currentMonthIndex >= 0 && (
              <svg>
                <line
                  x1={`${(currentMonthIndex / (data.length - 1)) * 100}%`}
                  y1="0%"
                  x2={`${(currentMonthIndex / (data.length - 1)) * 100}%`}
                  y2="100%"
                  stroke="#dddddd"
                  strokeWidth="1"
                  strokeDasharray="4 4"
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
                  dot={{ r: 2, strokeWidth: 2, stroke: line.color, fill: 'white' }}
                  activeDot={{ r: 5 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#29AAE1"
                strokeWidth={2}
                dot={{ r: 2, strokeWidth: 2, stroke: '#29AAE1', fill: 'white' }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend for the chart */}
      {lines && (
        <div className="flex mt-2 text-xs">
          {lines.map((line, index) => (
            <div key={index} className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: line.color }}></div>
              <span className="text-gray-500 capitalize">{line.dataKey} {title.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
