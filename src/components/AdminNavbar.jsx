import React from "react";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show confirmation alert before logging out
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isAdminLogin");
      navigate("/login");
    }
  };

  return (
    <nav className="min-h-[66px] sticky top-0 bg-white flex items-center justify-between px-[40px]">
      <img src="/logo.svg" alt="" />
      <button onClick={handleLogout} className="cursor-pointer">
        <IoLogOutOutline className="text-3xl" />
      </button>
    </nav>
  );
};

export default AdminNavbar;
