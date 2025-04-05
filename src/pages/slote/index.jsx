import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppointmentSuccessModal from "../../components/AppointmentSuccessModal";
import apiClent from "../../api/client";
import axios from "axios";

const SlotBooking = () => {
  // State variables
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [level, setLevel] = useState("date"); // date -> time -> notes
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState(null);
  const [isSuccess, setSuccess] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    description: "",
    skinImage: null,
    diagnosisResult: "",
  });

  const navigate = useNavigate();
  const { doctorId } = useParams();

  // Fetch doctor details and available slots on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchDoctorDetails(), fetchAvailableSlots()]);
      } catch (err) {
        setError("Failed to load doctor information");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadData();
    }
  }, [doctorId]);

  // API calls
  const fetchDoctorDetails = async () => {
    try {
      const response = await apiClent.get(`/api/7788/getDermatologist`, {
        headers: { ID: doctorId },
      });

      if (response.data.isSucess && response.data.data.length > 0) {
        setDoctorDetails(response.data.data[0]);
      } else {
        throw new Error("No doctor details found");
      }
    } catch (err) {
      setError("Failed to fetch doctor details");
      console.error(err);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await apiClent.get(`/api/7788/getSlotsByID`, {
        headers: { drmID: doctorId },
      });

      if (response.data.isSucess) {
        setAvailableSlots(response.data.data);

        // Extract unique days of week
        const uniqueDays = [
          ...new Set(response.data.data.map((slot) => slot.day_of_week)),
        ];
        setAvailableDays(uniqueDays);
      } else {
        throw new Error("No slots found");
      }
    } catch (err) {
      setError("Failed to fetch available slots");
      console.error(err);
    }
  };

  const uploadSkinImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await axios.post(
        "https://asasul-islam-cggqcsa8a9dtghbq.eastus-01.azurewebsites.net/api/8002/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
    }
  };

  const diagnoseSkinImage = async (imageFile) => {
    setIsProcessingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Add a slight delay to ensure the loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await apiClent.post("/api/7788/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setPatientDetails((prev) => ({
          ...prev,
          diagnosisResult:
            response.data.description || "No diagnosis available",
        }));
      } else {
        throw new Error("Failed to diagnose skin image");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      alert("Failed to analyze skin image. Please try again.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleAppointmentBooking = async (paymentRef) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // Upload image first if it exists
      let imageUrl = "";
      if (patientDetails.skinImage) {
        setIsProcessingImage(true);
        imageUrl = await uploadSkinImage(patientDetails.skinImage);
        setIsProcessingImage(false);
      }

      const bookingPayload = {
        availabilityId: selectedAvailabilityId,
        dermatologistId: parseInt(doctorId),
        bookingDate: new Date().toISOString(),
        startTime: selectedTimeSlot,
        endTime: calculateEndTime(selectedTimeSlot),
        patientName: patientDetails.name,
        patientID: userInfo.UserID,
        bookStatus: "Pending",
        paymentAmount: 500,
        paymentRef: paymentRef || "123",
        diesesDescription:
          patientDetails.description || patientDetails.diagnosisResult || "",
        diesesImageUrl: imageUrl || "",
      };

      const response = await apiClent.post(
        "/api/7788/postBooking",
        bookingPayload
      );

      if (response.data.isSucess) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setIsProcessingImage(false);
      alert("Failed to book appointment. Please try again.");
    }
  };

  // Razorpay Integration
  const handleRazorpayPayment = () => {
    if (isProcessingImage) return;

    const paymentOptions = {
      key: "rzp_test_5dXU4MS7cYNSIa",
      amount: 50000, // 500 INR in paise
      currency: "INR",
      name: "Medical Consultation",
      description: `Consultation with Dr. ${doctorDetails?.FullName}`,
      handler: function (response) {
        handleAppointmentBooking(response.razorpay_payment_id);
      },
      prefill: {
        name: patientDetails.name,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(paymentOptions);
    rzp1.open();
  };

  // Helper functions
  const calculateEndTime = (startTime) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":");
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes));
    startDate.setMinutes(startDate.getMinutes() + 30);
    return startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Available days state
  const [availableDays, setAvailableDays] = useState([]);

  // Get time slots for selected date
  const getTimeSlotsForSelectedDate = () => {
    if (!selectedDate) return [];

    // Filter slots for the selected day
    const daySlots = availableSlots.filter(
      (slot) => slot.day_of_week === selectedDate
    );

    return daySlots.map((slot) => ({
      time: slot.start_time,
      availabilityId: slot.availability_id,
    }));
  };

  // Event handlers
  const handleSubmit = () => {
    if (level === "date") {
      setLevel("time");
    } else if (level === "time") {
      setLevel("notes");
    } else {
      // Proceed to payment
      handleRazorpayPayment();
    }
  };

  const handleTimeSelection = (time, availabilityId) => {
    setSelectedTimeSlot(time);
    setSelectedAvailabilityId(availabilityId);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPatientDetails((prev) => ({ ...prev, skinImage: file }));
      await diagnoseSkinImage(file);
    }
  };

  // Validation
  const isStepValid = () => {
    switch (level) {
      case "date":
        return !!selectedDate;
      case "time":
        return !!selectedTimeSlot;
      case "notes":
        return !!patientDetails.name;
      default:
        return false;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  // No Doctor Found
  if (!doctorDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No doctor found
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 h-full flex flex-col justify-between py-6">
      <div>
        {/* Doctor Information Card */}
        <DoctorInfoCard doctorDetails={doctorDetails} />

        {/* Date Selection */}
        {level === "date" && (
          <DateSelection
            dateOptions={availableDays}
            selected={selectedDate}
            setSelected={setSelectedDate}
          />
        )}

        {/* Time Selection */}
        {level === "time" && (
          <TimeSelection
            timeSlots={getTimeSlotsForSelectedDate()}
            selected={selectedTimeSlot}
            onSelect={handleTimeSelection}
          />
        )}

        {/* Notes Section */}
        {level === "notes" && (
          <PatientDetailsForm
            patientDetails={patientDetails}
            setPatientDetails={setPatientDetails}
            handleImageUpload={handleImageUpload}
            isProcessingImage={isProcessingImage}
          />
        )}
      </div>

      {/* Success Modal */}
      <AppointmentSuccessModal
        isOpen={isSuccess}
        onClose={() => setSuccess(false)}
      />

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        disabled={!isStepValid() || isProcessingImage}
        className={`
          ${
            isStepValid() && !isProcessingImage
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-gray-300 cursor-not-allowed"
          } 
          transition-colors text-white font-medium py-4 rounded-lg w-full mt-6 flex items-center justify-center`}
      >
        {isProcessingImage ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : level === "notes" ? (
          "Proceed to Payment"
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
};

// Component for displaying doctor information
const DoctorInfoCard = ({ doctorDetails }) => (
  <div className="py-5 px-4 shadow-md border border-gray-100 flex-col rounded-lg flex">
    <div className="flex gap-x-3">
      <div className="w-20 h-20 overflow-hidden rounded-lg">
        <img
          src={doctorDetails?.ImageUrl}
          alt="Doctor"
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="flex flex-col gap-y-1.5">
        <h4 className="font-medium">{doctorDetails?.FullName}</h4>
        <div className="flex items-center gap-x-2">
          <img src="/icons/dr.svg" alt="Specialty" />
          <span className="text-sm text-gray-500 font-medium">
            {doctorDetails?.Specialty}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Date Selection Component
const DateSelection = ({ dateOptions, selected, setSelected }) => (
  <>
    <h4 className="text-lg font-medium mt-6">Choose Your Appointment Date</h4>
    <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
      <div className="flex flex-wrap gap-2">
        {dateOptions.map((date, index) => (
          <DateButton
            key={index}
            date={date}
            isSelected={selected === date}
            onClick={() => setSelected(date)}
          />
        ))}
      </div>
    </div>
  </>
);

// Time Selection Component
const TimeSelection = ({ timeSlots, selected, onSelect }) => (
  <>
    <h4 className="text-lg font-medium mt-6">Choose Your Appointment Time</h4>
    <div className="flex flex-wrap gap-2 mt-4">
      {timeSlots.map((slot, index) => (
        <TimeButton
          key={index}
          time={slot.time}
          isSelected={selected === slot.time}
          onClick={() => onSelect(slot.time, slot.availabilityId)}
        />
      ))}
    </div>
    {timeSlots.length === 0 && (
      <p className="text-red-500 mt-4">No available time slots for this day</p>
    )}
  </>
);

// Patient Details Form Component
const PatientDetailsForm = ({
  patientDetails,
  setPatientDetails,
  handleImageUpload,
  isProcessingImage,
}) => (
  <div>
    <h4 className="text-lg font-medium mt-6">Patient Details</h4>
    <div className="mt-4 space-y-4">
      <input
        type="text"
        placeholder="Patient Name"
        value={patientDetails.name}
        onChange={(e) =>
          setPatientDetails((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        className="w-full px-4 py-2 border rounded-lg"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Skin Image for Diagnosis
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-2 border rounded-lg"
          disabled={isProcessingImage}
        />

        {patientDetails.skinImage && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">
              Image selected: {patientDetails.skinImage.name}
            </p>
            {/* Image Preview */}
            <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs">
              <img
                src={URL.createObjectURL(patientDetails.skinImage)}
                alt="Skin image preview"
                className="w-full h-auto object-cover"
                onLoad={() => URL.revokeObjectURL(patientDetails.skinImage)}
              />
            </div>
          </div>
        )}

        {/* Image Processing Loading State */}
        {isProcessingImage && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div>
              <p className="text-blue-700 font-medium">
                Analyzing skin image...
              </p>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Our AI is processing your uploaded image to provide a preliminary
              diagnosis. This may take a few moments.
            </p>
          </div>
        )}

        {/* Diagnosis Result (only show when not loading) */}
        {!isProcessingImage && patientDetails.diagnosisResult && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h5 className="font-medium text-red-800">Preliminary Diagnosis:</h5>
            <p className="text-sm text-red-700 mt-1">
              {patientDetails.diagnosisResult}
            </p>
          </div>
        )}
      </div>

      <textarea
        placeholder="Describe your condition (optional)"
        value={patientDetails.description}
        onChange={(e) =>
          setPatientDetails((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
        className="w-full px-4 py-2 border rounded-lg h-32"
        disabled={isProcessingImage}
      />
    </div>
  </div>
);

// Reusable date button component
const DateButton = ({ date, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm rounded-lg border-2 cursor-pointer transition-colors
      ${
        isSelected
          ? "border-gray-500/70 text-gray-500 bg-gray-100"
          : "border-green-600/70 text-green-600 hover:bg-green-50"
      }`}
  >
    {date}
  </button>
);

// Reusable time button component
const TimeButton = ({ time, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm rounded-lg border-2 cursor-pointer transition-colors
      ${
        isSelected
          ? "border-gray-500/70 text-gray-500 bg-gray-100"
          : "border-green-600/70 text-green-600 hover:bg-green-50"
      }`}
  >
    {time}
  </button>
);

export default SlotBooking;
