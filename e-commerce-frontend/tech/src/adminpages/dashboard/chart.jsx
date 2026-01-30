import React, { useContext } from "react";
import { UserContext } from "./dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";




export default function Chart() {

const dashboardData = useContext(UserContext)

  const chartData = [
    { name: "Products", value: dashboardData.totalProducts },
    { name: "Pending Orders", value: dashboardData.pendingOrders },
 
    { name: "Total Users", value: dashboardData.totalUsers },
    { name: "Overall Orders", value: dashboardData.overallOrders },
   
  ];
  return (
    <div style={{ width: "90%", height: 500}}>
      <h2 style={{ textAlign: "center" }}>Overview</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
<Bar dataKey="value" fill="#3f98f7ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
