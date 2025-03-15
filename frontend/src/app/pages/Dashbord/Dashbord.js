"use client";

import Sidebar from "../../components/SideBar/SideBar";
import DonationChart from "../../components/StackedBarChart";
import { FaUsers, FaClipboardList, FaCheckCircle } from "react-icons/fa"; // Icons
import { useState } from "react";

export default function Dashboard() {
  const [filter, setFilter] = useState("Last 30 days");

  return (
    <div className="flex min-h-screen w-screen bg-white">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-md shadow-sm"
            >
              <option>Last 30 days</option>
              <option>Last 60 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Overview Section */}
        <h2 className="text-2xl font-semibold mt-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <OverviewCard
            icon={<FaUsers size={24} />}
            title="Total Volunteers"
            value="1500 Volunteers"
            trend="+12% increase from last month"
            bgColor="bg-red-200"
          />
          <OverviewCard
            icon={<FaClipboardList size={24} />}
            title="Active Tasks"
            value="24 Tasks Ongoing"
            trend="-10% decrease from last month"
            bgColor="bg-blue-200"
          />
          <OverviewCard
            icon={<FaCheckCircle size={24} />}
            title="Completed Projects"
            value="120 Events Done"
            trend="+25% increase from last month"
            bgColor="bg-green-200"
          />
          <OverviewCard
            icon={<FaCheckCircle size={24} />}
            title="Ongoing Projects"
            value="120 Events Done"
            trend="+25% increase from last month"
            bgColor="bg-yellow-200"
          />
        </div>

        {/* Donation & Contribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Donation & Contribution</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Date</th>
                  <th className="p-2">Food Donations (kg)</th>
                  <th className="p-2">Money Donations (Dz)</th>
                  <th className="p-2">Supply Donations</th>
                </tr>
              </thead>
              <tbody>
                <TableRow date="Jan 1" food="500 Kg" money="500 Dz" supply="10 boxes" />
                <TableRow date="Jan 5" food="1000 Kg" money="500 Dz" supply="10 boxes" />
                <TableRow date="Jan 10" food="900 Kg" money="500 Dz" supply="10 boxes" />
                <TableRow date="Jan 15" food="900 Kg" money="500 Dz" supply="10 boxes" />
                <TableRow date="Jan 18" food="900 Kg" money="500 Dz" supply="10 boxes" />
              </tbody>
            </table>
          </div>

          {/* Visualization Section */}
          <div className="bg-gray-300 p-6 rounded-lg shadow text-center">
          <DonationChart />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Overview Card Component */
function OverviewCard({ icon, title, value, trend, bgColor }) {
  return (
    <div className={`p-4 rounded-lg shadow ${bgColor} flex flex-col`}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-semibold">{title}</p>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{trend}</p>
    </div>
  );
}

/* Table Row Component */
function TableRow({ date, food, money, supply }) {
  return (
    <tr className="border-b">
      <td className="p-2">{date}</td>
      <td className="p-2">{food}</td>
      <td className="p-2">{money}</td>
      <td className="p-2">{supply}</td>
    </tr>
  );
}
