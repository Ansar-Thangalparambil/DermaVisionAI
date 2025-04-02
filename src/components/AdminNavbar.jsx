import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const handleClose = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <nav className="min-h-[66px] sticky top-0 bg-white flex items-center justify-between px-[60px]">
      <img src="/DermaVisionLogo.svg" alt="" />
      <ul className="flex items-center text-sm justify-center font-medium gap-x-10">
        <Link
          to={"/dashboard"}
          className="hover:text-[#333333]/60 cursor-pointer"
        >
          Dashboard
        </Link>
        <Link
          to={"/dashboard/appointments"}
          className="hover:text-[#333333]/60 cursor-pointer"
        >
          Appointments
        </Link>
        <Link
          to={"/dashboard/notification"}
          className="hover:text-[#333333]/60 cursor-pointer"
        >
          Notification
        </Link>
      </ul>
      <div className="flex gap-x-2 relative items-center justify-end">
        <div className="flex flex-col items-end">
          <h4 className="text-[#333333] text-sm">Sandy J</h4>
          <span className="text-xs text-[#333333]">
            sandyclavener@gmail.com
          </span>
        </div>
        <div
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="w-8 h-8 rounded-full  bg-[#D9D9D9]"
        ></div>
        {/* usre menu  */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="w-[192px]  absolute border border-gray-200
         rounded-lg shadow-md  p-5 py-1 bg-white flex flex-col top-full mt-3"
          >
            <li
              onClick={handleLogout}
              className="flex items-center cursor-pointer py-4 border-b border-b-[#DDDDDD] gap-x-2  w-full"
            >
              <img src="/icons/logout.svg" alt="" />
              <span className="text-sm">Logout</span>
            </li>
            <li className="flex items-center cursor-pointer py-4 gap-x-2  w-full">
              <img src="/icons/trash.svg" alt="" />
              <span className="text-sm text-[#EF4444]">Delete Account</span>
            </li>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
