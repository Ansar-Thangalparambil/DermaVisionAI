import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppointmentSuccessModal from "../../components/AppointmentSuccessModal";
import apiClent from "../../api/client";
import axios from "axios";

const SlotBooking = () => {
  // State variables
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedIsoDate, setSelectedIsoDate] = useState(null);
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => console.log(selectedIsoDate));

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

  // Camera handling
  useEffect(() => {
    if (showCameraModal) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [showCameraModal]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", {
              type: "image/jpeg",
            });
            setPatientDetails((prev) => ({ ...prev, skinImage: file }));
            setShowCameraModal(false);
            await diagnoseSkinImage(file);
          }
        },
        "image/jpeg",
        0.9
      );
    }
  };

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

  const handleAppointmentBooking = async (paymentRef, paymentAmount = 500) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // Upload image first if it exists
      let imageUrl = "";
      if (patientDetails.skinImage) {
        setIsProcessingImage(true);
        imageUrl = await uploadSkinImage(patientDetails.skinImage);
        setIsProcessingImage(false);
      }

      const dateStr = selectedIsoDate;
      const year = 2025;

      // Convert to a Date object
      const fullDateStr = `${dateStr} ${year}`;
      const date = new Date(fullDateStr);

      // Format to ISO string (date only part)
      const isoDate = date.toISOString().split("T")[0] + "T00:00:00";
      console.log(selectedIsoDate, isoDate);
      const bookingPayload = {
        availabilityId: selectedAvailabilityId,
        dermatologistId: parseInt(doctorId),
        bookingDate: isoDate,
        startTime: selectedTimeSlot,
        endTime: calculateEndTime(selectedTimeSlot),
        patientName: patientDetails.name,
        patientID: userInfo.UserID,
        bookStatus: "Pending",
        paymentAmount: paymentAmount,
        paymentRef: paymentRef || "no-payment-ref",
        diagonisisResult: patientDetails.diagnosisResult,
        diesesDescription: patientDetails.description,
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
    console.log(availableSlots, selectedDate);
    // Group slots by time and show availability
    const groupedSlots = daySlots.reduce((acc, slot) => {
      const timeKey = slot.start_time;
      if (!acc[timeKey]) {
        acc[timeKey] = {
          time: slot.start_time,
          availabilityId: slot.availability_id,
          count: 0,
        };
      }
      acc[timeKey].count++;
      return acc;
    }, {});

    return Object.values(groupedSlots).map((slot) => ({
      ...slot,
      isPopular: slot.count > 2, // Mark as popular if multiple slots available
    }));
  };

  // Event handlers for payment options
  const handlePaymentOption = (option) => {
    setShowPaymentModal(false);

    if (option === "online") {
      handleRazorpayPayment();
    } else {
      handleAppointmentBooking("normal-booking", 0);
    }
  };

  // Event handlers
  const handleSubmit = () => {
    if (level === "date") {
      setLevel("time");
    } else if (level === "time") {
      setLevel("notes");
    } else {
      setShowPaymentModal(true);
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

  const openCamera = () => {
    setShowCameraModal(true);
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
            setSelectedIsoDate={setSelectedIsoDate}
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
            openCamera={openCamera}
          />
        )}
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <CameraModal
          videoRef={videoRef}
          canvasRef={canvasRef}
          onCapture={captureImage}
          onClose={() => setShowCameraModal(false)}
        />
      )}

      {/* Payment Option Modal */}
      {showPaymentModal && (
        <PaymentOptionModal
          doctorName={doctorDetails?.FullName}
          onClose={() => setShowPaymentModal(false)}
          onSelectOption={handlePaymentOption}
        />
      )}

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
          "Continue to Booking"
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
};

// Camera Modal Component
const CameraModal = ({ videoRef, canvasRef, onCapture, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn overflow-hidden">
        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
          <h3 className="font-medium">Take a Photo</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto max-h-[70vh] object-contain"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 bg-gray-50 flex justify-center">
          <button
            onClick={onCapture}
            className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Doctor Information Card
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

// Payment Option Modal Component
const PaymentOptionModal = ({ doctorName, onClose, onSelectOption }) => {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Select Booking Option
          </h3>
          <p className="text-gray-600 mb-6">
            How would you like to proceed with your appointment with Dr.{" "}
            {doctorName}?
          </p>

          <div className="space-y-4">
            <button
              onClick={() => onSelectOption("online")}
              className="w-full p-4 border border-blue-500 bg-blue-50 rounded-lg text-blue-700 font-medium hover:bg-blue-100 transition flex items-center justify-between"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Online Payment
              </span>
              <span className="text-sm">₹500.00</span>
            </button>

            <button
              onClick={() => onSelectOption("normal")}
              className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition flex items-center justify-between"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Normal Booking
              </span>
              <span className="text-sm">Pay at Clinic</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Date Selection Component
const DateSelection = ({
  dateOptions,
  selected,
  setSelected,
  setSelectedIsoDate,
}) => {
  // Correct the day name typo from the API
  const correctedDayNames = dateOptions.map((day) =>
    day === "Wenesday" ? "Wednesday" : day
  );

  // Get next 7 days with their day names
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return {
      date: date,
      dayName: dayName,
      formattedDate: `${dayName.substring(
        0,
        3
      )}, ${date.getDate()} ${date.toLocaleString("default", {
        month: "short",
      })}`,
    };
  });

  // Filter to only show available days (using corrected day names)
  const availableDates = nextSevenDays.filter((day) =>
    correctedDayNames.includes(day.dayName)
  );

  return (
    <>
      <h4 className="text-lg font-medium mt-6">Choose Your Appointment Date</h4>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <div className="flex flex-wrap gap-2">
          {availableDates.map((day, index) => (
            <DateButton
              key={index}
              date={day.formattedDate}
              isSelected={selected === day.dayName}
              onClick={() => {
                setSelected(day.dayName);
                setSelectedIsoDate(day.formattedDate);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

// Time Selection Component
const TimeSelection = ({ timeSlots, selected, onSelect }) => {
  // Group time slots by morning/afternoon/evening
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    let period = "";

    if (hour < 12) period = "Morning";
    else if (hour < 17) period = "Afternoon";
    else period = "Evening";

    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(slot);
    return acc;
  }, {});

  // Function to convert 24hr time to 12hr format
  const formatTo12Hour = (time) => {
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour);
    const amPm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minute} ${amPm}`;
  };

  return (
    <>
      <h4 className="text-lg font-medium mt-6">Choose Your Appointment Time</h4>
      <div className="mt-4 space-y-6">
        {Object.entries(groupedSlots).map(([period, slots]) => (
          <div key={period}>
            <h5 className="text-sm font-medium text-gray-500 mb-2">{period}</h5>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot, index) => (
                <TimeButton
                  key={index}
                  time={formatTo12Hour(slot.time)}
                  isSelected={selected === slot.time}
                  isPopular={slot.isPopular}
                  onClick={() => onSelect(slot.time, slot.availabilityId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {timeSlots.length === 0 && (
        <p className="text-red-500 mt-4">
          No available time slots for this day
        </p>
      )}
    </>
  );
};
// Patient Details Form Component
const PatientDetailsForm = ({
  patientDetails,
  setPatientDetails,
  handleImageUpload,
  isProcessingImage,
  openCamera,
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
        <div className="flex gap-2">
          <label className="flex-1">
            <div className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer text-center">
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isProcessingImage}
              />
            </div>
          </label>
          <button
            onClick={openCamera}
            disabled={isProcessingImage}
            className="flex-1 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use Camera
          </button>
        </div>

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
const TimeButton = ({ time, isSelected, onClick, isPopular }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm rounded-lg border-2 cursor-pointer transition-colors relative
      ${
        isSelected
          ? "border-gray-500/70 text-gray-500 bg-gray-100"
          : "border-green-600/70 text-green-600 hover:bg-green-50"
      }`}
  >
    {time}
    {isPopular && !isSelected && (
      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
        Popular
      </span>
    )}
  </button>
);

export default SlotBooking;
