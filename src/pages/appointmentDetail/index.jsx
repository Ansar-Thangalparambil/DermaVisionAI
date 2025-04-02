import React from "react";
import { Calendar, Clock, Monitor, Edit2, X } from "lucide-react";

const AppointmentDetailPage = () => {
  return (
    <div className="px-[60px] py-6 mx-auto  bg-white rounded-lg shadow-sm">
      {/* Appointment Header */}
      <div className="border-b pb-4">
        <h2 className="text-sm font-medium text-gray-500 mb-3">Appointment</h2>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-md overflow-hidden">
            <img
              src="/doctor.jpeg"
              alt="Doctor profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">Dr. Aswin Mananath</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span>General Physician</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium mr-1">3.8</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= 4 ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Appointment Notes */}
      <div className="py-4 border-b">
        <h2 className="text-sm font-medium text-gray-500 mb-3">
          Pre Appointment Notes
        </h2>
        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
          <p className="mb-2">
            I have been experiencing persistent discomfort over the past few
            days. I've been feeling a dull pain in my lower back that worsens
            when I sit for long periods. This pain sometimes radiates down my
            left leg, making it difficult to walk or stand for too long. I also
            feel occasional numbness and tingling in my foot.
          </p>
          <p className="mb-2">
            Additionally, I've been having frequent headaches and mild
            dizziness, especially in the mornings. My appetite has decreased,
            and I feel more fatigued than usual. I haven't had a fever, but I do
            feel a slight heaviness in my chest at times.
          </p>
          <p>
            I wanted to check if these symptoms could be related and whether I
            need any tests or immediate treatment. Looking forward to your
            advice.
          </p>
        </div>
        <button className="mt-2 text-blue-500 text-sm font-medium flex items-center justify-center mx-auto py-1 px-6 hover:bg-gray-50 rounded">
          <Edit2 size={16} className="mr-1" />
          Edit
        </button>
      </div>

      {/* Appointment Details */}
      <div className="py-4">
        <h2 className="text-sm font-medium text-gray-500 mb-3">
          Appointment Details
        </h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar size={18} className="text-gray-400 mr-3" />
            <div>
              <span className="text-sm text-gray-500">Date:</span>
              <span className="text-sm ml-1">March 5, 2025</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock size={18} className="text-gray-400 mr-3" />
            <div>
              <span className="text-sm text-gray-500">Time:</span>
              <span className="text-sm ml-1">10:30 AM</span>
            </div>
          </div>
          <div className="flex items-center">
            <Monitor size={18} className="text-gray-400 mr-3" />
            <div>
              <span className="text-sm text-gray-500">Consultation Type:</span>
              <span className="text-sm ml-1">Video/In-Clinic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <button className="flex items-center justify-center py-3 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
          <X size={16} className="mr-2" />
          Cancel appointment
        </button>
        <button className="flex items-center justify-center py-3 px-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;
