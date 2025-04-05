import React from "react";
import { Outlet } from "react-router-dom";
import DermNavabar from "../components/DermatologistNavbar";

const DermoLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col">
        <DermNavabar />
        <Outlet />
      </div>
    </>
  );
};

export default DermoLayout;
