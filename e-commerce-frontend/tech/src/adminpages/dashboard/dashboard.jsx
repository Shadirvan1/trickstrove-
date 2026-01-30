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

        // Calculate pending revenue if null
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

  return (
    <UserContext.Provider value={dashboardData}>
      <>
        <h1 className="h1">Dashboard</h1>

        <div className="user_div">
          <div>
            <h1>Total products: {dashboardData.totalProducts}</h1>
          </div>
          <div>
            <h1>Pending orders: {dashboardData.pendingOrders}</h1>
          </div>
          <div>
            <h1>Pending revenue: {dashboardData.pendingSales}</h1>
          </div>
          <div>
            <h1>Total users: {dashboardData.totalUsers}</h1>
          </div>
          <div>
            <h1>Overall orders: {dashboardData.overallOrders}</h1>
          </div>
          <div>
            <h1>Overall sales: {dashboardData.overallSales}</h1>
          </div>
        </div>

        <div className="chart">
          <Chart />
        </div>
        <div className="sales">
          <SalesChart />
        </div>
      </>
    </UserContext.Provider>
  );
}
