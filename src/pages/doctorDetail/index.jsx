import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorProfilePage = () => {
  const navigate = useNavigate();
  const handleAppointment = () => {
    navigate("/slot");
  };
  return (
    <div className="px-[60px] py-6 h-full bg-white shadow-sm rounded-lg overflow-y-auto">
      {/* Doctor Header Section */}
      <div className="p-4 shadow-md rounded-lg flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img
            src="/doctor.jpeg"
            alt="Dr. Aakash Mehta"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col">
            <h1 className="text-lg font-medium">Dr. Aakash Mehta</h1>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>Orthopedic Specialist</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="font-medium mr-1">4.0</span>
              <div className="flex">
                {[1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg
                  className="w-4 h-4 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm font-medium">
              Available Now
            </span>
          </div>
        </div>
      </div>

      <div className="shadow-md rounded-3xl py-2 mt-5">
        {/* Tags Section */}
        <div className="px-4 py-3 flex flex-wrap gap-2">
          <span className="px-3 py-2 bg-[#29939233]/60 text-[#299392] rounded-md text-xs">
            #BoneHealth
          </span>
          <span className="px-3 py-2 bg-[#29939233]/60 text-[#299392] rounded-md text-xs">
            #JointPain
          </span>
          <span className="px-3 py-2 bg-[#29939233]/60 text-[#299392] rounded-md text-xs">
            #FractureCare
          </span>
          <span className="px-3 py-2 bg-[#29939233]/60 text-[#299392] rounded-md text-xs">
            #SportsTreatment
          </span>
        </div>

        {/* About Doctor Section */}
        <div className="px-4 py-3">
          <h2 className="font-medium mb-2">About Doctor:</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Dr. Aakash Mehta is a highly experienced orthopedic specialist with
            over 15 years of expertise in treating bone and joint-related
            conditions. He is known for his patient-friendly approach and
            advanced treatment methods for fractures, arthritis, and sports
            injuries. Dr. Mehta has successfully performed multiple complex
            orthopedic surgeries and believes in personalized care for every
            patient.
          </p>
        </div>

        {/* Available Timings Section */}
        <div className="px-4 py-3 ">
          <h2 className="font-medium mb-2">Available Timings:</h2>
          <div className="text-sm flex flex-col gap-y-4">
            <div className="mb-1 flex flex-col  gap-y-2">
              <span className="font-medium text-gray-600">
                Monday - Friday:
              </span>
              <span className=" ">10:00 AM - 1:00 PM</span>
            </div>
            <div className="mb-1 flex flex-col  gap-y-2">
              <span className="font-medium text-gray-600">Saturday :</span>
              <span className=" ">10:00 AM - 2:00 PM</span>
            </div>
            <div className="mb-1 flex flex-col  gap-y-2">
              <span className="font-medium text-gray-600">Sunday :</span>
              <span className=" ">Not Available</span>
            </div>
          </div>
        </div>

        {/* Areas of Expertise Section */}
        <div className="px-4 py-3 ">
          <h2 className="font-medium mb-2">Areas of Expertise:</h2>
          <ul className="text-sm space-y-3 mt-4">
            <li className="flex items-start gap-x-3">
              <img src="/icons/point.svg" alt="" />
              Joint & Knee Pain Management
            </li>
            <li className="flex items-start gap-x-3">
              <img src="/icons/point.svg" alt="" />
              Fracture & Dislocation Treatment
            </li>
            <li className="flex items-start gap-x-3">
              <img src="/icons/point.svg" alt="" />
              Spine & Back Pain Solutions
            </li>
            <li className="flex items-start gap-x-3">
              <img src="/icons/point.svg" alt="" />
              Arthritis & Osteoporosis Care
            </li>
            <li className="flex items-start gap-x-3">
              <img src="/icons/point.svg" alt="" />
              Sports Injuries Rehabilitation
            </li>
          </ul>
        </div>

        {/* Book Appointment Button */}
        <div className="px-4 py-4 ">
          <button
            onClick={handleAppointment}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Book Appointment
          </button>
        </div>
      </div>
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

export default DoctorProfilePage;
