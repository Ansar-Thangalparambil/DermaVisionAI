import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import SideBar from "../components/SideBar";

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <AdminNavbar />
      <div className="h-full flex overflow-hidden">
        {/* sidebar  */}
        <SideBar />
        <div className="py-5 px-[18px] bg-gray-50 w-full h-full flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
