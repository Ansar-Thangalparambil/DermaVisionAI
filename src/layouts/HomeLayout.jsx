import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default HomeLayout;
