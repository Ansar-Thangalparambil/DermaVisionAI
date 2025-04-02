import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <AdminNavbar />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
