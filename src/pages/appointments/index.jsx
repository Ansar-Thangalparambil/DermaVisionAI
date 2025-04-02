import React from "react";
import { Link } from "react-router-dom";

const Appointments = () => {
  return (
    <div className="flex flex-col px-[60px] py-6">
      <div className="py-5 px-4 shadow-md border border-gray-100 flex-col rounded-lg flex">
        <div className="flex items-center mb-4 justify-between">
          <span className="font-medium">Appointment</span>
          <span className="text-[#229B59]">Mar 11 - 08:00 am</span>
        </div>
        <div className="flex gap-x-3">
          <div className="w-20 h-20 overflow-hidden rounded-lg">
            <img
              src="/doctor.jpeg"
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-y-1.5">
            <h4 className="font-medium">Dr. Aswin Mananath</h4>
            <div className="flex items-center gap-x-2">
              <img src="/icons/dr.svg" alt="Specialty" />
              <span className="text-sm text-gray-500 font-medium">
                General Physician
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <span className="font-medium">3.6</span>
              <div className="flex gap-x-1 items-center">
                {[1, 2, 3].map((i) => (
                  <img key={i} src="/icons/star.svg" alt="Star" />
                ))}
                <img src="/icons/rate.svg" alt="Empty star" />
              </div>
            </div>
          </div>
        </div>
        <Link
          to={"/appointments/23"}
          className="mt-4 font-medium flex items-center justify-center py-4 text-white bg-[#299392] rounded-lg text-sm"
        >
          View Booking
        </Link>
      </div>
      {/* our doctors section  */}
      <h4 className="text-lg font-medium mt-9">Our Doctors</h4>
      <div className="w-full grid grid-cols-3 gap-5 mt-4">
        {/* doctor card  */}
        {new Array(6).fill(" ").map((_, index) => (
          <div
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
