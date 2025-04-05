import React from "react";

const StatCard = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-4 py-6 flex items-center"
        >
          <div
            className={`w-16 h-16  ${stat.color} rounded-[12px] flex items-center 
          justify-center text-white mr-4`}
          >
            <img src={`/icons/${stat.icon}`} alt="" className="w-8" />
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-[#B3B3B3] text-sm font-medium">{stat.title}</p>
            <p className="text-3xl font-semibold text-[#333333]">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCard;
