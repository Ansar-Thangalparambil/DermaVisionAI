import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Parse user info from localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }

    // Close menu when clicking outside
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
    // Clear user info from localStorage
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="min-h-[66px] sticky top-0 z-50 bg-white flex items-center justify-between px-[60px]">
      <img src="/logo.svg" alt="Logo" />

      <ul className="flex items-center text-sm justify-center font-medium gap-x-10">
        <Link to={"/"} className="hover:text-[#333333]/60 cursor-pointer">
          Home
        </Link>
        <Link
          to={"/appointments"}
          className="hover:text-[#333333]/60 cursor-pointer"
        >
          Appointments
        </Link>
        <Link to={"/help"} className="hover:text-[#333333]/60 cursor-pointer">
          Help
        </Link>
      </ul>

      <div className="flex gap-x-2 relative items-center justify-end">
        {userInfo ? (
          <>
            <div className="flex flex-col items-end">
              <h4 className="text-[#333333] text-sm">
                {userInfo?.FullName || "User"}
              </h4>
              <span className="text-xs text-[#333333]">
                {userInfo?.Email || "user@example.com"}
              </span>
            </div>
            <div
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#D9D9D9]"
            ></div>
          </>
        ) : (
          <Link
            to="/login"
            className="text-sm hover:text-[#333333]/60 cursor-pointer"
          >
            Login
          </Link>
        )}

        {/* User menu */}
        {isMenuOpen && userInfo && (
          <div
            ref={menuRef}
            className="w-[192px] absolute border border-gray-200 rounded-lg shadow-md p-5 py-1 bg-white flex flex-col top-full mt-3"
          >
            <li
              onClick={handleLogout}
              className="flex items-center cursor-pointer py-4 border-b border-b-[#DDDDDD] gap-x-2 w-full"
            >
              <img src="/icons/logout.svg" alt="Logout" />
              <span className="text-sm">Logout</span>
            </li>
            <li
              onClick={handleDeleteAccount}
              className="flex items-center cursor-pointer py-4 gap-x-2 w-full"
            >
              <img src="/icons/trash.svg" alt="Delete Account" />
              <span className="text-sm text-[#EF4444]">Delete Account</span>
            </li>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
