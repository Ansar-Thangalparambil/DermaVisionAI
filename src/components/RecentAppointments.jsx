import React, { useEffect, useState } from "react";
import apiClent from "../api/client";

const RecentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await apiClent.get("/api/7788/getAppoimets", {
          headers: {
            UserID: parseInt(localStorage.getItem("userId")),
          },
        });

        if (response.data.isSucess) {
          setAppointments(response.data.data.list);
          setFilteredAppointments(response.data.data.list);
          setPrescriptions(response.data.data.prescription || []);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch appointments"
          );
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Unable to load your appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Apply date filters whenever the filter values or appointments change
  useEffect(() => {
    applyDateFilter();
  }, [dateFilter, appointments]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Handle date filter changes
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply date filter to appointments
  const applyDateFilter = () => {
    let filtered = [...appointments];

    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.booking_date);
        return appDate >= startDate;
      });
    }

    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.booking_date);
        return appDate <= endDate;
      });
    }

    setFilteredAppointments(filtered);
  };

  // Reset date filters
  const resetDateFilter = () => {
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  // Get status badge based on booking status
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case "cancelled":
      case "cancel":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Check if appointment has prescription
  const hasPrescription = (bookingId) => {
    return prescriptions.some(
      (prescription) => prescription.booking_id === bookingId
    );
  };

  // Get prescriptions for a booking
  const getPrescriptionsForBooking = (bookingId) => {
    return prescriptions.filter(
      (prescription) => prescription.booking_id === bookingId
    );
  };

  // Format prescription date
  const formatPrescriptionDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Toggle prescription modal
  const togglePrescription = (bookingId) => {
    if (selectedPrescription === bookingId) {
      setSelectedPrescription(null);
    } else {
      setSelectedPrescription(bookingId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-2">😞</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-6">Your Appointment History</h1>

      {/* Date Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium mb-3">Filter Appointments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={resetDateFilter}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-xl mb-2">📅</p>
          <p className="text-gray-500">
            {appointments.length === 0
              ? "No appointment history found"
              : "No appointments match your filter criteria"}
          </p>
          {appointments.length > 0 && (
            <button
              onClick={resetDateFilter}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              Show All Appointments
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.Booking_id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4 bg-white">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="font-medium text-lg">
                      Appointment with Dr. {appointment.Dermatologist}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {formatDate(appointment.booking_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {appointment.start_time.slice(0, 5)} -{" "}
                          {appointment.end_time.slice(0, 5)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 self-start">
                    {getStatusBadge(appointment.bookStatus)}
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Condition Description:
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.DiesesDescription ||
                        "No description provided"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Payment Details:
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Amount: ₹{appointment.PaymentAmount}</p>
                      <p className="truncate">
                        Reference: {appointment.PaymentRef}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {appointment.google_meet_link && (
                    <a
                      href={appointment.google_meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Join Video Consultation
                    </a>
                  )}

                  {hasPrescription(appointment.Booking_id) && (
                    <button
                      onClick={() => togglePrescription(appointment.Booking_id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {selectedPrescription === appointment.Booking_id
                        ? "Hide Prescription"
                        : "Show Prescription"}
                    </button>
                  )}
                </div>

                {appointment.CancelReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md">
                    <h4 className="text-sm font-medium text-red-800">
                      Cancellation Reason:
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      {appointment.CancelReason}
                    </p>
                  </div>
                )}

                {/* Prescription Details */}
                {selectedPrescription === appointment.Booking_id && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-md font-medium text-green-800 mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Prescription Details
                    </h4>

                    {getPrescriptionsForBooking(appointment.Booking_id).map(
                      (prescription, index) => (
                        <div
                          key={prescription.prescription_id}
                          className={`p-3 ${
                            index > 0
                              ? "mt-3 pt-3 border-t border-green-200"
                              : ""
                          }`}
                        >
                          <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Medicine:
                              </p>
                              <p className="text-sm text-green-800">
                                {prescription.medicine_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Dosage:
                              </p>
                              <p className="text-sm text-green-800">
                                {prescription.dosage}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Duration:
                              </p>
                              <p className="text-sm text-green-800">
                                {prescription.duration} days
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Notes:
                              </p>
                              <p className="text-sm text-green-800">
                                {prescription.notes}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-green-600">
                            Prescribed on:{" "}
                            {formatPrescriptionDate(prescription.prescribed_at)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentAppointments;
