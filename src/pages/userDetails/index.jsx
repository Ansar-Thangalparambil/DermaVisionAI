import React, { useState, useEffect } from "react";
import BookingHistory from "../../components/BookingHistory";
import { useParams } from "react-router-dom";
import apiClent from "../../api/client";

const UserDetails = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams(); // Get userId from URL params

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await apiClent.get("/api/7788/getAppoimets", {
          headers: {
            userId: userId, // Pass userId in the header as requested
          },
        });

        // Check if the API call was successful based on the isSucess flag
        if (response.data.isSucess) {
          setAppointments(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch appointments"
          );
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        console.error("Error fetching appointments:", err);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  if (loading) {
    return <div className="p-5 text-center">Loading appointment data...</div>;
  }

  if (error) {
    return <div className="p-5 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <section className="flex flex-col w-full h-full overflow-y-auto gap-y-4">
      <UserCard patient={appointments.length > 0 ? appointments[0] : null} />

      <h4 className="text-lg font-medium">Upcoming Appointments</h4>

      {appointments.length === 0 ? (
        <div className="p-5 text-center">No upcoming appointments</div>
      ) : (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.Booking_id}
            appointment={appointment}
          />
        ))
      )}
    </section>
  );
};

export default UserDetails;

// Dynamic UserCard component using patient data from the appointment
const UserCard = ({ patient }) => {
  if (!patient) return null;

  return (
    <div className="flex items-center justify-between p-5 py-7 bg-white rounded-xl shadow-md">
      <div className="flex flex-col cursor-pointer">
        <div className="flex items-center gap-x-10 justify-between">
          <h5 className="font-medium text-lg">{patient.patient_name}</h5>
          <span
            className={`bg-[#66CC9933]/50 text-[#66CC99] text-sm px-[14px] py-2 rounded-2xl`}
          >
            Active
          </span>
        </div>
        <div className="flex flex-col mt-2 text-sm text-[#AAAAAA] gap-y-1">
          <span>Patient ID: {patient.patientID}</span>
          <span>Payment Reference: {patient.PaymentRef}</span>
        </div>
      </div>
    </div>
  );
};

// Dynamic AppointmentCard component using the actual API response structure
const AppointmentCard = ({ appointment }) => {
  // Format date from API (2025-03-28T00:00:00)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time from API (10:30:00)
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center justify-between p-5 py-7 bg-white rounded-xl shadow-md">
      <div className="flex flex-col cursor-pointer">
        <div className="flex items-center gap-x-10 justify-between">
          <h5 className="font-medium text-lg">
            Dr. {appointment.Dermatologist}
          </h5>
        </div>
        <div className="flex flex-col mt-2 text-sm text-[#AAAAAA] gap-y-1">
          <span className="flex items-center gap-x-2">
            <img src="/icons/doctor.svg" alt="" />
            Dermatologist
          </span>
          <span className="flex items-center gap-x-2">
            <img src="/icons/calender.svg" alt="" />
            {formatDate(appointment.booking_date)},{" "}
            {formatTime(appointment.start_time)}
          </span>
          <span className="flex items-center gap-x-2 mt-1">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded ${
                appointment.bookStatus === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {appointment.bookStatus}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
