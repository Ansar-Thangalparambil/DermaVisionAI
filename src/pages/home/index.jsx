import React from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Banner from "../../components/banner";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* navbar section  */}

      {/* content section  */}
      <div className="px-[60px] flex flex-col py-6">
        <Banner />

        {/* our doctors section  */}
        <h4 className="text-lg font-medium mt-9">Our Doctors</h4>
        <div className="w-full grid grid-cols-3 gap-5 mt-4">
          {/* doctor card  */}
          {new Array(6).fill(" ").map((_, index) => (
            <Link
              to={"/category/Cardiology"}
              key={index}
              className="py-5 px-4 shadow-md border border-gray-100 rounded-lg flex  justify-between"
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
      </div>
    </div>
  );
};

export default Home;
