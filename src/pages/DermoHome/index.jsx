import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import apiClent from "../../api/client";

const DermoHome = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    cards: [],
    todayList: [],
    upcomingList: [],
    cancelList: [],
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering and modal
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("today");

  // State for cancellation
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get dermatologist ID from localStorage
      const dermatologist = localStorage.getItem("dermatologistToken");
      let dermoData;
      if (dermatologist) {
        dermoData = JSON.parse(dermatologist)?.[0];
      } else {
        dermoData = {
          DermatologistID: 12,
        };
      }

      // Fetch dashboard data from API
      const response = await apiClent.get(
        "/api/7788/getDermatologistDashBoard",
        {
          headers: {
            ID: parseInt(dermoData?.DermatologistID), // Assuming ID needs to be passed as header
          },
        }
      );

      if (response.data && response.data.isSucess) {
        setDashboardData(response.data.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancelBooking = async () => {
    if (!selectedUser || !cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }

    try {
      setCancelLoading(true);
      setCancelError(null);

      // Make API call to cancel booking
      const response = await apiClent.delete("/api/7788/bookingCancel", {
        headers: {
          bookingID: selectedUser.Booking_id,
          reason: cancelReason,
        },
      });

      if (response.data && response.data.isSucess) {
        setCancelSuccess(true);

        // Refresh dashboard data after successful cancellation
        setTimeout(() => {
          fetchDashboardData();
          setShowCancelModal(false);
          setSelectedUser(null);
          setCancelSuccess(false);
          setCancelReason("");
        }, 1500);
      } else {
        setCancelError(response.data?.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setCancelError("An error occurred while cancelling the booking");
    } finally {
      setCancelLoading(false);
    }
  };

  // Get active appointment list based on tab
  const getActiveList = () => {
    switch (activeTab) {
      case "today":
        return dashboardData.todayList || [];
      case "upcoming":
        return dashboardData.upcomingList || [];
      case "cancelled":
        return dashboardData.cancelList || [];
      default:
        return dashboardData.todayList || [];
    }
  };

  // Apply filters to the active list
  const filteredAppointments = getActiveList().filter(
    (appointment) =>
      appointment.patient_name
        .toLowerCase()
        .includes(nameFilter.toLowerCase()) &&
      (dateFilter === "" ||
        (appointment.booking_date &&
          appointment.booking_date.includes(dateFilter)))
  );

  // Format date string for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    } catch (e) {
      return dateString;
    }
  };

  // Create summary cards data from API response
  const getSummaryData = () => {
    const cards =
      dashboardData.cards && dashboardData.cards.length > 0
        ? dashboardData.cards[0]
        : {};

    return [
      {
        icon: "📅",
        label: "Today's Appointments",
        value: cards.TodayBooking || "0",
        color: "bg-blue-500",
      },
      {
        icon: "📆",
        label: "Upcoming Appointments",
        value: cards.Upcomig || "0", // Note: API has a typo "Upcomig"
        color: "bg-green-500",
      },
      {
        icon: "❌",
        label: "Cancelled Appointments",
        value: cards.Cancelled || "0",
        color: "bg-red-500",
      },
    ];
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 overflow-y-auto h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {getSummaryData().map((item, index) => (
          <div
            key={index}
            className={`${item.color} text-white rounded-lg p-4 shadow-md`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{item.icon}</span>
              <div>
                <div className="text-sm opacity-75">{item.label}</div>
                <div className="text-xl font-bold">{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${
            activeTab === "today"
              ? "border-b-2 border-blue-500 text-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("today")}
        >
          Today's Appointments
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Appointments
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "cancelled"
              ? "border-b-2 border-blue-500 text-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled Appointments
        </button>
      </div>

      {/* Filtering Inputs */}
      <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Filter by Patient Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="md:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Filter by Date (YYYY-MM-DD)"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="md:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">
            {activeTab === "today" && "Today's Appointments"}
            {activeTab === "upcoming" && "Upcoming Appointments"}
            {activeTab === "cancelled" && "Cancelled Appointments"}
          </h2>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No appointments found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.Booking_id}
                className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-800">
                    {appointment.patient_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(appointment.booking_date)} |{" "}
                    {appointment.start_time?.slice(0, 5)} -{" "}
                    {appointment.end_time?.slice(0, 5)}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        appointment.bookStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.bookStatus === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.bookStatus}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(appointment)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Patient Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 w-full flex flex-col">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <span className="font-medium">{selectedUser.patient_name}</span>
              </div>
              <div>
                <p>
                  <strong>Booking ID:</strong> {selectedUser.Booking_id}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedUser.booking_date)}
                </p>
                <p>
                  <strong>Time:</strong> {selectedUser.start_time?.slice(0, 5)}{" "}
                  - {selectedUser.end_time?.slice(0, 5)}
                </p>
                <p>
                  <strong>Status:</strong> {selectedUser.bookStatus}
                </p>
                <p>
                  <strong>Payment Amount:</strong> ₹{selectedUser.PaymentAmount}
                </p>
                <p>
                  <strong>Payment Ref:</strong> {selectedUser.PaymentRef}
                </p>
                {selectedUser.DiesesDescription && (
                  <p>
                    <strong>Problem Description:</strong>{" "}
                    {selectedUser.DiesesDescription}
                  </p>
                )}
                {selectedUser.google_meet_link && (
                  <p>
                    <strong>Meeting Link:</strong>{" "}
                    <a
                      href={selectedUser.google_meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Join Meeting
                    </a>
                  </p>
                )}
                {selectedUser.CancelReason && (
                  <p>
                    <strong>Cancel Reason:</strong> {selectedUser.CancelReason}
                  </p>
                )}
              </div>

              {/* Conditionally render action buttons based on appointment status */}
              {selectedUser.bookStatus === "Pending" && (
                <div>
                  <Link
                    to={`/dermotolgist/schedule-consult/${selectedUser.Booking_id}`}
                    className="text-white flex items-center justify-center cursor-pointer hover:bg-green-500 font-medium bg-green-400 py-3 rounded-xl w-full mt-3"
                  >
                    Schedule Consult
                  </Link>
                  <button
                    className="text-white flex items-center justify-center font-medium bg-red-400 cursor-pointer hover:bg-red-500 py-3 rounded-xl w-full mt-2"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}

              {selectedUser.bookStatus === "Confirmed" &&
                selectedUser.google_meet_link && (
                  <a
                    href={selectedUser.google_meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white flex items-center justify-center cursor-pointer hover:bg-blue-500 font-medium bg-blue-400 py-3 rounded-xl w-full mt-3"
                  >
                    Join Consultation
                  </a>
                )}

              {/* Cancel button for Confirmed appointments */}
              {selectedUser.bookStatus === "Confirmed" && (
                <button
                  className="text-white flex items-center justify-center font-medium bg-red-400 cursor-pointer hover:bg-red-500 py-3 rounded-xl w-full mt-2"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => !cancelLoading && setShowCancelModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cancel Appointment</h2>
              <button
                onClick={() => !cancelLoading && setShowCancelModal(false)}
                className="text-gray-600 hover:text-gray-900"
                disabled={cancelLoading}
              >
                ✕
              </button>
            </div>

            {cancelSuccess ? (
              <div className="text-center p-4">
                <div className="text-green-500 text-4xl mb-3">✓</div>
                <p className="text-lg font-medium text-green-600">
                  Appointment cancelled successfully!
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4">
                  Are you sure you want to cancel the appointment with{" "}
                  <span className="font-bold">
                    {selectedUser?.patient_name}
                  </span>
                  ?
                </p>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Reason for cancellation:
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Please provide a reason for cancellation"
                    disabled={cancelLoading}
                  ></textarea>
                </div>

                {cancelError && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                    {cancelError}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => !cancelLoading && setShowCancelModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={cancelLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex justify-center items-center"
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    ) : null}
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DermoHome;
