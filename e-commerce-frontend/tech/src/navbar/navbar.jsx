import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Heart, House } from "lucide-react";
import mylogo from "../pics/porsche.png";
import { useEffect } from "react";
import guest from "../pics/guest.png";
import login from "../pics/login.png";
import AOS from "aos";
export default function Navbar() {

   useEffect(() => {
    AOS.init({
      duration: 1500,  // animation duration in ms
      easing: "ease-in-out", // smooth animation
      once: true,      // animate only once when scrolling down
    });
  }, []);

  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("username"));
  const [profileOpen, setProfileOpen] = useState(false);
  const username = localStorage.getItem("username1");
  const toggleProfile = () => setProfileOpen(!profileOpen);
    const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("username1");
    localStorage.removeItem("cartlength");
    setUserId(null);
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header 
    data-aos="fade-down"
    className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/30 border-b border-white/10 z-50 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/home")}>
          <img src={mylogo} alt="Logo" className="h-10 w-auto" />
        </div>


        {/* Nav */}
        <nav className="flex items-center gap-4">
 
          <NavLink to="/" className="p-2 rounded-md hover:bg-white/10 transition">
            <House className="text-blue-400" strokeWidth={2} />
          </NavLink>
          {userId ? (
            <>
              <NavLink to="wishlist" className="p-2 rounded-md hover:bg-white/10 transition">
                <Heart className="text-pink-500" strokeWidth={1.5} />
              </NavLink>

              <NavLink to="orders" className="p-2 rounded-md hover:bg-white/10 transition">
                <Package className="text-blue-400" />
              </NavLink>

              <NavLink to="cart" className="p-2 rounded-md hover:bg-white/10 transition">
                <ShoppingCart className="text-blue-400" />
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                Login
              </NavLink>

              <NavLink to="/register" className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
                Sign Up
              </NavLink>
            </>
          )}

          {/* Profile */}
          <div className="relative">
            <img
              src={userId ? login : guest}
              alt="Profile"
              onClick={toggleProfile}
              className="h-10 w-10 rounded-full cursor-pointer border-2 border-white/50 hover:border-blue-400 transition"
            />

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md text-white rounded-md shadow-lg border border-white/10 py-2 z-50">
                {!userId ? (
                  <>
                    <div onClick={() => navigate("/login")} className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer">Login</div>
                    <div onClick={() => navigate("/register")} className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer">Register</div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-300">Hello, <span className="font-semibold text-white">{username}</span></div>
                    <div onClick={() => navigate("/")} className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer flex items-center gap-2"><House className="text-blue-400" /> Home</div>
                    <div onClick={() => navigate("/cart")} className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer flex items-center gap-2"><ShoppingCart className="text-blue-400" /> Cart</div>
                    <div onClick={() => navigate("/wishlist")} className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer flex items-center gap-2"><Heart className="text-pink-500" /> Wishlist</div>
                    <div onClick={() => navigate("/orders")} className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer flex items-center gap-2"><Package className="text-blue-400" /> Orders</div>
                    <div onClick={logout} className="px-4 py-2 text-sm hover:bg-red-600 cursor-pointer text-red-400 font-medium">Logout</div>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
