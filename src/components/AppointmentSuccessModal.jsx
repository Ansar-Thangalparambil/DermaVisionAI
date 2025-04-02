import React from "react";

const AppointmentSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg max-w-2xl w-full p-6 flex 
      py-10 flex-col items-center text-center animate-fade-in"
      >
        {/* Doctor illustration */}
        <div className="w-40 h-40 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <img
            src="/success.png"
            alt="Online doctor illustration"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Confirmation text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Doctor's Appointment Confirmed!
        </h2>

        <p className="text-gray-600 mb-1">
          Your appointment has been successfully booked.
        </p>
        <p className="text-gray-600 mb-8">
          You can find the details in your appointment history.
        </p>

        {/* Action button */}
        <button
          onClick={onClose}
          className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          Let's Go
        </button>
      </div>
    </div>
  );
};

export default AppointmentSuccessModal;
