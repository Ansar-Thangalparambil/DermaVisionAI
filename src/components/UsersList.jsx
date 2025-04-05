import React from "react";

const UsersList = () => {
  return (
    <div className="bg-white flex flex-col rounded-[14px]">
      <div className="flex items-center justify-between p-5">
        <h4 className="text-2xl font-semibold">Users</h4>
        <div className="relative  w-full max-w-sm">
          <input
            type="text"
            placeholder="Search Users..."
            className="bg-[#EEEEEE] w-full placeholder-[#000000] pl-13 font-light py-3 px-5 rounded-xl"
          />
          <img
            src="/icons/search.svg"
            className="absolute top-0 left-5 bottom-0 m-auto"
            alt=""
          />
        </div>
      </div>
      <table>
        <thead className="bg-[#EEEEEE] text-[#B3B3B3] text-sm ">
          <th className="font-medium py-4 text-left pl-5">NAME</th>
          <th className="font-medium py-4 text-left">E-MAIL</th>
          <th className="font-medium py-4 text-center">REGISTERED</th>
          <th className="font-medium py-4 text-center">STATUS</th>
          <th className="font-medium py-4 text-center pr-5">ACTIONS</th>
        </thead>
        <tbody>
          {new Array(4).fill(" ").map((_, index) => (
            <tr key={index} className="border-b border-[#EEEEEE]">
              <td className="py-4 pl-5 font-light">Emma Wilson</td>
              <td className="font-light text-[#B3B3B3] text-sm">
                emmawilson123@gmail.com
              </td>
              <td className="text-center font-light text-[#B3B3B3] text-sm">
                Jan 15, 2025
              </td>
              <td className="text-center">
                <span className="bg-[#66CC9933] text-[#66CC99] text-sm py-[6px] px-3.5 rounded-[14px]">
                  Active
                </span>
              </td>
              <td className=" gap-x-2 flex  py-4 pr-5  items-center justify-center">
                <button className="bg-black w-8 h-8 rounded-lg flex items-center justify-center ">
                  <img src="/icons/eye.svg" alt="" />
                </button>
                <button className="bg-[#CC3333] w-8 h-8 rounded-lg flex items-center justify-center ">
                  <img src="/icons/remove.svg" alt="" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
