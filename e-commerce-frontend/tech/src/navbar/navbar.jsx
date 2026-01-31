import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Heart, House, Search } from "lucide-react";
import mylogo from "../pics/favicon.png";
import guest from "../pics/guest.png";
import login from "../pics/login.png";
import AOS from "aos";
import { useAppContext } from "../appcontext";

export default function Navbar() {
  const { orderCount,cartCount, searchQuery, setSearchQuery } = useAppContext();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const [profileOpen, setProfileOpen] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    AOS.init({ duration: 1200, easing: "ease-in-out", once: true });
  }, []);

  const logout = () => {
    localStorage.clear();
    setUserId(null);
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header
      data-aos="fade-down"
      className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 text-white">

        <div
          onClick={() => navigate("/")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <img src={mylogo} alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/10 text-white placeholder-gray-300
                         pl-12 pr-4 py-2 rounded-full border border-white/20
                         focus:border-white/40 focus:bg-white/15 outline-none transition"
            />
          </div>
        </div>

        <nav className="flex items-center gap-2">

          <NavLink to="/" className="icon-btn">
            <House />
          </NavLink>

          {userId && (
            <>
              <NavLink to="/wishlist" className="icon-btn">
                <Heart className="text-pink-500" />
              </NavLink>

              <NavLink to="/orders" className="icon-btn">
                <Package />
            
              </NavLink>

              <NavLink to="/cart" className="icon-btn relative">
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs
                                   w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </>
          )}

          {!userId && (
            <>
              <NavLink to="/login" className="auth-btn bg-blue-600/80 hover:bg-blue-600">
                Login
              </NavLink>
              <NavLink to="/register" className="auth-btn bg-green-600/80 hover:bg-green-600">
                Sign Up
              </NavLink>
            </>
          )}

          <div className="relative">
            <img
              src={userId ? login : guest}
              onClick={() => setProfileOpen(!profileOpen)}
              className="h-9 w-9 rounded-full border border-white/30 cursor-pointer
                         hover:border-white/60 hover:scale-105 transition"
              alt="profile"
            />

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-black/70 backdrop-blur-xl
                              rounded-xl border border-white/10 shadow-xl overflow-hidden">
                {userId ? (
                  <>
                    <div className="px-4 py-3 text-sm text-gray-300">
                      {username}
                    </div>
                    <div className="menu-item" onClick={() => navigate("/")}>Home</div>
                    <div className="menu-item" onClick={() => navigate("/cart")}>Cart</div>
                    <div className="menu-item" onClick={() => navigate("/wishlist")}>Wishlist</div>
                    <div className="menu-item" onClick={() => navigate("/orders")}>Orders</div>
                    <div
                      onClick={logout}
                      className="px-4 py-2 text-sm text-red-400 cursor-pointer hover:bg-red-600/40"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div className="menu-item" onClick={() => navigate("/login")}>Login</div>
                    <div className="menu-item" onClick={() => navigate("/register")}>Register</div>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Tailwind helpers */}
      <style>
        {`
          .icon-btn {
            @apply p-2 rounded-full cursor-pointer transition
                   hover:bg-white/10 hover:scale-110;
          }
          .auth-btn {
            @apply px-4 py-1.5 rounded-full text-sm text-white cursor-pointer transition;
          }
          .menu-item {
            @apply px-4 py-2 text-sm cursor-pointer hover:bg-white/10;
          }
        `}
      </style>
    </header>
  );
}
