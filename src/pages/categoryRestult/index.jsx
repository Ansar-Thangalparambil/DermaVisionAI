import React from "react";
import { Link, useParams } from "react-router-dom";

const CategoryResult = () => {
  const { categoryName } = useParams();
  return (
    <div className="px-[60px] py-6  h-full flex flex-col">
      <h4 className="text-lg font-medium">
        Find Expert “Cardiology” Doctors for Your Care
      </h4>
      {categoryName === "Cardiology" && (
        <div className="w-full h-fit  grid grid-cols-3 gap-5 mt-4">
          {/* doctor card  */}
          {new Array(6).fill(" ").map((_, index) => (
            <Link
              to={`/doctors/aswin`}
              key={index}
              className="py-5 px-4 shadow-md border border-gray-100 h-fit rounded-lg flex  justify-between"
            >
              <div className="flex  gap-x-3 ">
                <div className="w-[80px] h-[80px] overflow-hidden rounded-lg">
                  <img src="/doctor.jpeg" alt="" />
                </div>
                <div className="flex flex-col gap-y-[6px]">
                  <h4 className=" font-medium">Dr. Aswin Mananath</h4>
                  <div className="flex items-center gap-x-2">
                    <img src="/icons/dr.svg" alt="" />
                    <span className="text-sm text-[#333333]/60 font-medium translate-y-0.5">
                      General Physician
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="font-medium">3.6</span>
                    <div className="flex gap-x-2 items-center">
                      <img src="/icons/star.svg" alt="" />
                      <img src="/icons/star.svg" alt="" />
                      <img src="/icons/star.svg" alt="" />
                      <img src="/icons/rate.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-[#229B59]">Online</span>
            </Link>
          ))}
        </div>
      )}
      {categoryName !== "Cardiology" && (
        <div className="flex items-center justify-center h-full">
          <img src="/noCategory.png" alt="" className="w-[450px]" />
        </div>
      )}
    </div>
  );
};

export default CategoryResult;
