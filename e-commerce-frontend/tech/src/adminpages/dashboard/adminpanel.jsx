import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Panel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAdmin = () => {
    navigate("/adminpanel/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <aside className="w-64 bg-slate-900 text-gray-200 flex flex-col fixed inset-y-0 left-0">
        
        <div
          onClick={handleAdmin}
          className="cursor-pointer px-6 py-5 text-xl font-bold tracking-wide border-b border-slate-700 hover:text-white"
        >
          Admin Panel
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { name: "Dashboard", path: "dashboard" },
            { name: "Order Details", path: "orderdetails" },
            { name: "User Details", path: "userdetails" },
            { name: "Products", path: "products" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}
