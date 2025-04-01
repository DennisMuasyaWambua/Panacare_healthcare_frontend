"use client"
import React from 'react';
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChevronDown, ChevronUp, Search, Menu, X } from 'lucide-react';


const sampleData1 = [
    { name: '1 Sep', value: 10 },
    { name: '5 Sep', value: 15 },
    { name: '10 Sep', value: 8 },
    { name: '15 Sep', value: 12 },
    { name: '20 Sep', value: 18 },
    { name: '25 Sep', value: 15 },
    { name: '30 Sep', value: 20 },
  ];
  
const sampleData2 = [
    { name: '1 Sep', patientsValue: 10, doctorsValue: 8, hospitalsValue: 12 },
    { name: '5 Sep', patientsValue: 12, doctorsValue: 15, hospitalsValue: 10 },
    { name: '10 Sep', patientsValue: 8, doctorsValue: 10, hospitalsValue: 14 },
    { name: '15 Sep', patientsValue: 15, doctorsValue: 7, hospitalsValue: 9 },
    { name: '20 Sep', patientsValue: 18, doctorsValue: 12, hospitalsValue: 15 },
    { name: '25 Sep', patientsValue: 15, doctorsValue: 18, hospitalsValue: 13 },
    { name: '30 Sep', patientsValue: 20, doctorsValue: 15, hospitalsValue: 17 },
  ];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Analytics card data
  const analyticsCards = [
    {
      title: 'Patients',
      totalValue: '948,558',
      growthValue: '79,046',
      growthUp: true,
      chartData1: sampleData1,
      chartData2: sampleData2,
      compareValue: '200,558',
      compareUp: false,
      percentValue: '16,558',
      percentUp: false,
    },
    {
      title: 'Doctors',
      totalValue: '948,558',
      growthValue: '79,046',
      growthUp: true,
      chartData1: sampleData1,
      chartData2: sampleData2,
      compareValue: '200,558',
      compareUp: false,
      percentValue: '16,558',
      percentUp: false,
    },
    {
      title: 'Hospitals',
      totalValue: '948,558',
      growthValue: '79,046',
      growthUp: true,
      chartData1: sampleData1,
      chartData2: sampleData2,
      compareValue: '200,558',
      compareUp: false,
      percentValue: '16,558',
      percentUp: false,
    },
    {
      title: 'Number of Subscriptions',
      totalValue: '948,558',
      growthValue: '79,046',
      growthUp: true,
      chartData1: sampleData1,
      chartData2: sampleData2,
      compareValue: '200,558',
      compareUp: false,
      percentValue: '16,558',
      percentUp: false,
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static w-64 h-full bg-white shadow-md z-10 transition-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center">
            <div className="text-blue-500 font-bold text-lg">
              Pana<span className="text-red-500">Care</span>
            </div>
            <span className="ml-3 text-gray-500 text-sm">Dashboard</span>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="pt-4">
          <div className="px-4 mb-2">
            <div className="flex items-center bg-gray-100 p-2 rounded-md">
              <Search size={18} className="text-gray-400" />
              <span className="text-gray-400 ml-2 text-sm">Search menu</span>
            </div>
          </div>

          <ul className="mt-2">
            <li className="px-4 py-2 flex items-center text-blue-500 bg-blue-50 border-l-4 border-blue-500">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <rect width="20" height="20" x="2" y="2" rx="2" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8H4z" />
              </svg>
              <span className="text-sm">App Users</span>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 14V8H4v6h8l4 4v-4h4z" />
              </svg>
              <span className="text-sm">App Content</span>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12l-8 4V6l8-4 8 4v10l-8 4z" />
              </svg>
              <span className="text-sm">Manage Units</span>
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v6H4V4zm0 10h16v6H4v-6z" />
              </svg>
              <span className="text-sm">System Vitals</span>
              <ChevronDown size={16} className="ml-auto" />
            </li>

            <li className="px-4 py-2 flex items-center text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
              </svg>
              <span className="text-sm">Manage Users</span>
              <ChevronDown size={16} className="ml-auto" />
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm px-4 py-3 flex justify-end">
          <div className="flex items-center text-sm text-gray-600">
            <span>View as Admin</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          {analyticsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <h2 className="text-blue-500 text-lg font-medium mb-4">{card.title}</h2>
              
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">TOTAL NUMBER OF {card.title.toUpperCase()}</div>
                  <div className="text-xl font-bold text-purple-600">{card.totalValue}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">GROWTH (MONTHLY)</div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-purple-600">{card.growthValue}</span>
                    {card.growthUp ? (
                      <ChevronUp className="ml-2 text-green-500" size={18} />
                    ) : (
                      <ChevronDown className="ml-2 text-red-500" size={18} />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">COMPARED TO LAST MONTH</div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-purple-600">{card.compareValue}</span>
                    {card.compareUp ? (
                      <ChevronUp className="ml-2 text-green-500" size={18} />
                    ) : (
                      <ChevronDown className="ml-2 text-red-500" size={18} />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">PERCENTAGE</div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-purple-600">{card.percentValue}</span>
                    {card.percentUp ? (
                      <ChevronUp className="ml-2 text-green-500" size={18} />
                    ) : (
                      <ChevronDown className="ml-2 text-red-500" size={18} />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1 */}
                <div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">AVERAGE MONTHLY {card.title.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-blue-500 mb-2">Total Patients</div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={card.chartData1}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                          tickFormatter={(value) => value}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#38b2ac"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Chart 2 */}
                <div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">ACTUAL PATIENTS VS EXPECTED PATIENTS</span>
                  </div>
                  <div className="flex text-xs mb-2">
                    <div className="mr-4">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                      <span className="text-blue-500">Actual Patients</span>
                    </div>
                    <div>
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                      <span className="text-red-500">Expected Patients</span>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={card.chartData2}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                          tickFormatter={(value) => value}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="patientsValue"
                          stroke="#3182ce"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="doctorsValue"
                          stroke="#e53e3e"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="hospitalsValue"
                          stroke="#805ad5"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export default Dashboard