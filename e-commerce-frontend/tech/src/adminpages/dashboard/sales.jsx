import React, { useContext } from "react";
import { UserContext } from "../dashboard/dashboard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SalesChart() {
  const dashboardData = useContext(UserContext);

  const chartData = [
    {
      name: "Sales",
      Pending: dashboardData.pendingSales,
      Overall: dashboardData.overallSales,
    }
  ];

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 style={{ textAlign: "center" }}>Sales Overview</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Pending" fill="#ff7300" />
          <Bar dataKey="Overall" fill="#387908" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
