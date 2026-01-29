import React from "react";
import axios from "axios";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./adminpanel.css"

export default function Panel (){
const navigate = useNavigate()
const adminId =  localStorage.removeItem("adminId");




  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminId");
    navigate("/admin");
  }
  const handleAdmin = () => {
   
    navigate("/adminpanel/dashboard");
  }




    return(
      <>
<div className="admin_layout">
        <aside className="contain_div">
          <h2 className="sidebar_title" onClick={handleAdmin}>Admin Panel</h2>

          <NavLink to="dashboard" className="sidebar_link">
            Dashboard
          </NavLink>

          <NavLink to="orderdetails" className="sidebar_link">
            Order Details
          </NavLink>

          <NavLink to="userdetails" className="sidebar_link">
            User Details
          </NavLink>

          <NavLink to="products" className="sidebar_link">
            Products
          </NavLink>

          <button className="logout_btn" onClick={handleLogout}>
            Log Out
          </button>
        </aside>

<Outlet />


      </div>
</>
    )
}