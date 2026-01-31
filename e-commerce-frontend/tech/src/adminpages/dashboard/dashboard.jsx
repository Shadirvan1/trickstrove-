import React, { createContext, useEffect, useState } from "react";
import adminapi from "../../api/adminapi";
import Chart from "./chart";
import SalesChart from "./sales";

export const UserContext = createContext();

export default function Dash() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    pendingSales: 0,
    totalUsers: 0,
    overallOrders: 0,
    overallSales: 0,
  });

  useEffect(() => {
    adminapi
      .get("dashboard/details/")
      .then((res) => {
        const data = res.data;

        const pendingRevenue = data.pending_revenue || 0;
        const totalRevenue = data.total_revenue || 0;

        setDashboardData({
          totalProducts: data.total_products,
          pendingOrders: data.order_details.reduce(
            (acc, item) =>
              item.status !== "DELIVERED" ? acc + item.product_count : acc,
            0
          ),
          pendingSales: pendingRevenue,
          totalUsers: data.total_users,
          overallOrders: data.overall_orders,
          overallSales: totalRevenue,
        });
      })
      .catch((err) => console.log("Error fetching dashboard data:", err));
  }, []);

  const stats = [
    { label: "Total Products", value: dashboardData.totalProducts },
    { label: "Pending Orders", value: dashboardData.pendingOrders },
    { label: "Pending Revenue", value: `₹ ${dashboardData.pendingSales}` },
    { label: "Total Users", value: dashboardData.totalUsers },
    { label: "Overall Orders", value: dashboardData.overallOrders },
    { label: "Overall Sales", value: `₹ ${dashboardData.overallSales}` },
  ];

  return (
    <UserContext.Provider value={dashboardData}>
      <div className="space-y-8">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
  
  <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
    <h2 className="mb-4 text-lg font-semibold text-gray-700">
      Orders Overview
    </h2>

    <div className="w-[100%]">
      <Chart />
    </div>
  </div>

  <div className="w-[100%] rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
    <h2 className="mb-4 text-lg font-semibold text-gray-700">
      Sales Overview
    </h2>

    <div>
      <SalesChart />
    </div>
  </div>

</div>


      </div>
    </UserContext.Provider>
  );
}
