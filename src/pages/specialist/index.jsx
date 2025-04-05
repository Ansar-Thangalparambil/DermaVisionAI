import React, { useEffect, useRef, useState } from "react";
import DoctorCard from "../../components/DoctorCard";

const Specialist = () => {
  return (
    <section className="flex flex-col w-full h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">All Specialties</h4>
        <button className="bg-[#229B59] flex items-center gap-x-2 rounded-lg py-3 px-4 text-white  cursor-pointer">
          <img src="/icons/add.svg" alt="" />
          <span className="text-sm">Add New</span>
        </button>
      </div>
      <div className="w-full h-fit mt-4 gap-4 grid grid-cols-2">
        {new Array(8).fill(" ").map((_, index) => (
          <SpecialistCard key={index} />
        ))}
      </div>
      <h4 className="text-lg mt-7 font-medium ">Dermatologist</h4>
      <div className="w-full grid grid-cols-3  gap-5 mb-7 mt-4">
        {/* doctor card  */}
        {new Array(6).fill(" ").map((_, index) => (
          <DoctorCard admin={true} key={index} />
        ))}
      </div>
    </section>
  );
};

export default Specialist;

const SpecialistCard = () => {
  const [isOpen, setOpen] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const handleClose = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.addEventListener("mousedown", handleClose);
    };
  }, []);
  return (
    <div className="py-4 px-[14px] h-[94px] rounded-lg bg-white flex items-start ">
      <img src="/icons/department.svg" alt="" />
      <div className="flex flex-col ml-3 h-full w-full justify-between">
        <div className="flex items-center justify-between">
          <span>Medical Dermatology</span>
          <button
            onClick={() => setOpen(!isOpen)}
            className="cursor-pointer relative"
          >
            <img src="/icons/dot.svg" alt="" />
            {isOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 z-50 w-[152px] h-fit rounded-lg bg-white shadow-md p-3 px-5"
              >
                <button className="flex items-center py-3 text-sm w-full gap-x-2 cursor-pointer border-b border-[#DDDDDD]">
                  <img src="/icons/edit.svg" alt="" />
                  <span>Edit</span>
                </button>
                <button className="flex text-[#EF4444] items-center py-3 text-sm gap-x-2 cursor-pointer ">
                  <img src="/icons/remove.svg" alt="" />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </button>
        </div>
        <span className="text-sm text-[#33333399]/60">6 Doctors</span>
      </div>
    </div>
  );
};
