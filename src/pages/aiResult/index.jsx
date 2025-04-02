import React from "react";

const AIResult = () => {
  return (
    <div className="px-[60px] py-6">
      <div className="w-full p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
        {/* Diagnosis Result */}
        <div className="mb-6">
          <h2 className="text-gray-600 inline-block font-medium mr-2">
            Diagnosis Result :{" "}
          </h2>
          <span className="font-semibold">Possible Migraine</span>
        </div>

        {/* Symptoms Analyzed */}
        <div className="mb-6">
          <h2 className="text-gray-600 mb-3 font-medium">
            Symptoms Analyzed :
          </h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">
              Headache on one side of the head
            </li>
            <li className="text-sm text-gray-700">
              Sensitivity to light and sound
            </li>
            <li className="text-sm text-gray-700">Nausea and dizziness</li>
            <li className="text-sm text-gray-700">Blurred vision</li>
          </ul>
        </div>

        {/* Suggested Next Steps */}
        <div>
          <h2 className="text-gray-600 mb-3 font-medium">
            Suggested Next Steps :
          </h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">
              Stay hydrated and rest in a dark, quiet room
            </li>
            <li className="text-sm text-gray-700">
              Avoid strong lights and loud noises
            </li>
            <li className="text-sm text-gray-700">
              Take prescribed pain relievers if symptoms persist
            </li>
            <li className="text-sm text-gray-700">
              Consult a neurologist for further evaluation
            </li>
          </ul>
        </div>
      </div>
      <h4 className="text-lg font-medium mt-9">
        AI Suggested Doctors for Your Care
      </h4>
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

export default AIResult;
