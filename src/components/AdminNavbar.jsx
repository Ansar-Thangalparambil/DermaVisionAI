import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isAdminLogin");
    navigate("/login");
  };
  return (
    <nav className="min-h-[66px] sticky top-0 bg-white flex items-center justify-between px-[40px]">
      <img src="/logo.svg" alt="" />
      <button onClick={handleLogout} className="cursor-pointer">
        <img src="/logout.svg" alt="" />
      </button>
    </nav>
  );
};

export default AdminNavbar;
