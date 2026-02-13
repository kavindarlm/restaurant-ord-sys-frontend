import React, { useState } from "react";
import logo from "../assets/image 21.png";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { toast } from "react-toastify";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="fixed top-6 left-0 right-0 bg-amber-950 rounded-full mx-6 md:mx-6 flex items-center justify-between p-2">
      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-5 bg-white rounded-full p-2 shadow-md">
        <img src={logo} className="h-16 w-16 object-contain" alt="logo" />
      </div>

      {/* Left Section */}
      <div className="flex-1 pl-4">
        <span className="text-white text-xl font-bold">ABC Hotel</span>
      </div>

      {/* Hamburger button for Mobile */}
      <button
        onClick={toggleMenu}
        type="button"
        className="inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg md:hidden"
      ></button>

      {/* Admin info and Logout */}
      <div className="flex items-center gap-3 pr-4">
        {admin && (
          <span className="text-white text-sm hidden md:inline">
            👤 {admin.user_name || admin.user_email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center text-white hover:text-orange-300 transition-colors"
        >
          <IoLogOut className="text-lg mr-1" />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
