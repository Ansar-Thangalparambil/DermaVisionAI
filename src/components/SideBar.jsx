import React from "react";
import { SIDE_BAR_ITEMS } from "../constant";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div className="w-[290px]  h-full p-3">
      <ul className="flex flex-col gap-y-2">
        {SIDE_BAR_ITEMS.map((item) => (
          <li
            onClick={() => navigate(`/dashboard${item.path}`)}
            className={` ${
              pathname === `/dashboard${item.path}` && `bg-[#1E6F6D] text-white`
            } p-4 rounded-lg hover:bg-[#1E6F6D] cursor-pointer
           hover:text-white flex items-center gap-x-2 text-[#B3B3B3]`}
          >
            <item.icon className="text-xl" />
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
