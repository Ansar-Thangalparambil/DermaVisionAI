import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClent from "../../api/client";

const convertTo12HourFormat = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hourNum = parseInt(hours);
  const period = hourNum >= 12 ? "PM" : "AM";
  const adjustedHour = hourNum % 12 || 12;
  return `${adjustedHour}:${minutes} ${period}`;
};

const DoctorProfilePage = ({ admin = false }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { doctorId } = useParams(); // Assuming you're using route params to get doctorId

  const handleAppointment = () => {
    navigate(`/slot/${doctorDetails?.DermatologistID}`);
  };

  // Fetch Doctor Details
  const fetchDoctorDetails = async () => {
    try {
      const response = await apiClent.get(`/api/7788/getDermatologist`, {
        headers: {
          ID: doctorId,
        },
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

  // Fetch Available Slots
  const fetchAvailableSlots = async () => {
    try {
      const response = await apiClent.get(`/api/7788/getSlotsByID`, {
        headers: {
          drmID: doctorId,
        },
      });

      // Assuming the response structure matches your requirement
      // You might need to adjust this based on the actual API response
      setAvailableSlots(response.data.data);
    } catch (err) {
      setError("Failed to fetch available slots");
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchDoctorDetails(), fetchAvailableSlots()]);
      } catch (err) {
        setError("Failed to load doctor information");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadData();
    }
  }, [doctorId]);

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
    <div
      className={` ${
        !admin && ` bg-white px-[60px] py-6  shadow-sm rounded-lg`
      } h-full   overflow-y-auto`}
    >
      {/* Doctor Header Section */}
      <div
        className={`${
          admin && "bg-white"
        } p-4 shadow-md rounded-lg flex items-center justify-between `}
      >
        <div className="flex items-start gap-4 ">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img
              src={doctorDetails.ImageUrl || "/doctor.jpeg"}
              alt={`Dr. ${doctorDetails.FullName}`}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col">
              <h1 className="text-lg font-medium">
                Dr. {doctorDetails.FullName}
              </h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>{doctorDetails.Specialty}</span>
              </div>
              {/* <div className="flex items-center mt-1">
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
              </div> */}
            </div>
            <div className="mt-2">
              {!admin && (
                <span className="text-green-600 text-sm font-medium">
                  Available Now
                </span>
              )}
            </div>
          </div>
        </div>
        {/* {admin && (
          <div className="flex items-center justify-center gap-x-2">
            <button className="bg-[#808080] py-[10px] text-sm px-4 text-white rounded-xl cursor-pointer">
              Edit
            </button>
            <button className="bg-[#EF4444] py-[10px] text-sm px-4 text-white rounded-xl cursor-pointer">
              Remove User
            </button>
          </div>
        )} */}
      </div>

      <div className="shadow-md rounded-3xl bg-white py-2 mt-5">
        {/* About Doctor Section */}
        <div className="px-4 py-3">
          <h2 className="font-medium mb-2">About Doctor:</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {doctorDetails.Description || "No description available"}
          </p>
        </div>

        {/* Contact Information */}
        <div className="px-4 py-3">
          <h2 className="font-medium mb-2">Contact Information:</h2>
          <p className="text-sm text-gray-600">
            Contact No: {doctorDetails.ContactNo}
            <br />
            Email: {doctorDetails.PortalLoginID}
          </p>
        </div>

        {/* Available Timings Section */}
        <div className="px-4 py-3 ">
          <h2 className="font-medium mb-2">Available Slots:</h2>
          <div className="text-sm flex flex-col gap-y-4">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <div key={index} className="mb-1 flex flex-col gap-y-2">
                  <span className="font-medium text-gray-600">
                    {slot.day_of_week}:
                  </span>
                  <span>
                    {convertTo12HourFormat(slot.start_time)} -{" "}
                    {convertTo12HourFormat(slot.end_time)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No available slots</p>
            )}
          </div>
        </div>

        {/* Book Appointment Button */}
        {!admin && (
          <div className="px-4 py-4 ">
            <button
              onClick={handleAppointment}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfilePage;
