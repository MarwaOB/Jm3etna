"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data (You can replace this with actual API data)
const data = [
  { date: "Jan 1", Food: 500, Money: 500, Supplies: 10 },
  { date: "Jan 5", Food: 1000, Money: 500, Supplies: 10 },
  { date: "Jan 10", Food: 900, Money: 500, Supplies: 10 },
  { date: "Jan 15", Food: 900, Money: 500, Supplies: 10 },
  { date: "Jan 18", Food: 900, Money: 500, Supplies: 10 },
];

const DonationChart = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-center mb-4">Donation Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Food" stackId="a" fill="#4CAF50" />
          <Bar dataKey="Money" stackId="a" fill="#FFC107" />
          <Bar dataKey="Supplies" stackId="a" fill="#2196F3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationChart;
