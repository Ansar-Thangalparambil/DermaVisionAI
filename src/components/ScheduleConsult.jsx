import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const ScheduleConsult = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Form state
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingScheduledTime, setMeetingScheduledTime] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { medicineName: "", dosage: "", duration: "", notes: "" },
  ]);

  // Fetch booking details on component mount
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);

        // Fetch dashboard data which contains all bookings
        const response = await apiClient.get(
          "/api/7788/getDermatologistDashBoard",
          {
            headers: {
              ID: localStorage.getItem("dermatologistId") || 12,
            },
          }
        );

        if (response.data && response.data.isSucess) {
          // Combine all booking lists
          const allBookings = [
            ...(response.data.data.todayList || []),
            ...(response.data.data.upcomingList || []),
            ...(response.data.data.cancelList || []),
          ];

          // Find the booking with matching ID
          const booking = allBookings.find(
            (booking) => booking.Booking_id.toString() === bookingId.toString()
          );

          if (booking) {
            setBookingDetails(booking);

            // Pre-fill the meeting link if it exists
            if (booking.google_meet_link) {
              setMeetingLink(booking.google_meet_link);
            }

            // Pre-fill the scheduled time if it exists (convert booking_date and start_time)
            if (booking.booking_date && booking.start_time) {
              try {
                const datePart = booking.booking_date.split("T")[0];
                const timePart = booking.start_time.slice(0, 5);
                setMeetingScheduledTime(`${datePart}T${timePart}`);
              } catch (e) {
                console.error("Error parsing date/time", e);
              }
            }
          } else {
            setError(`Booking with ID ${bookingId} not found`);
          }
        } else {
          setError("Failed to fetch booking details");
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("An error occurred while fetching booking details");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // Add a new prescription field
  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineName: "", dosage: "", duration: "", notes: "" },
    ]);
  };

  // Remove a prescription field
  const removePrescription = (index) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions.splice(index, 1);
    setPrescriptions(updatedPrescriptions);
  };

  // Update prescription field values
  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!meetingLink || !meetingScheduledTime) {
      setError("Please fill in all required fields");
      return;
    }

    // Filter out empty prescriptions
    const validPrescriptions = prescriptions.filter(
      (p) => p.medicineName.trim() !== "" && p.dosage.trim() !== ""
    );

    if (validPrescriptions.length === 0) {
      setError("Please add at least one valid prescription");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get dermatologist ID from localStorage
      const dermatologistId = localStorage.getItem("dermatologistId") || 0;

      const prescriptionData = {
        bookingId: parseInt(bookingId),
        dermatologistId: parseInt(dermatologistId),
        patientName: bookingDetails?.patient_name || "",
        meetingLink,
        meetingSheduledTime: meetingScheduledTime,
        prescriptions: validPrescriptions,
      };

      // Call the API to post prescription
      const response = await apiClient.post(
        "/api/7788/postPrescription",
        prescriptionData
      );

      if (response.data && response.data.isSucess) {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(response.data?.message || "Failed to schedule consultation");
      }
    } catch (err) {
      console.error("Error posting prescription:", err);
      setError("An error occurred while scheduling the consultation");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !bookingDetails) {
    return (
      <div className="p-6 bg-gray-100 h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading booking details...</div>
      </div>
    );
  }

  if (error && !bookingDetails) {
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
    <div className="p-6 bg-gray-100 overflow-y-auto min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-4 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Schedule Consultation</h1>
        </div>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Success!</p>
            <p>
              Consultation scheduled successfully. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Patient Information */}
            {bookingDetails && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  Patient Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="mb-2">
                      <span className="font-medium">Patient Name:</span>{" "}
                      {bookingDetails.patient_name}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Booking ID:</span>{" "}
                      {bookingDetails.Booking_id}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Date:</span>{" "}
                      {bookingDetails.booking_date
                        ? new Date(
                            bookingDetails.booking_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Time:</span>{" "}
                      {bookingDetails.start_time
                        ? bookingDetails.start_time.slice(0, 5)
                        : "N/A"}
                      {bookingDetails.end_time
                        ? ` - ${bookingDetails.end_time.slice(0, 5)}`
                        : ""}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          bookingDetails.bookStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : bookingDetails.bookStatus === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bookingDetails.bookStatus || "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* Problem Description and Image Section */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Problem Description</h3>
                    <div className="mb-3 p-3 bg-white rounded border">
                      {bookingDetails.DiesesDescription ||
                        "No description provided"}
                    </div>

                    {bookingDetails.DiesesImageUrl && (
                      <div>
                        <h3 className="font-medium mb-2">Patient's Image</h3>
                        <div className="border rounded overflow-hidden h-48 flex items-center justify-center bg-white">
                          {/* Using placeholder since we can't access blob URLs */}
                          {/* <div className="text-center p-4">
                            <p className="text-gray-400 mb-2">
                              Image available in system
                            </p>
                            <p className="text-xs text-gray-500">
                              {bookingDetails.DiesesImageUrl}
                            </p>
                          </div> */}
                          <img
                            src={bookingDetails?.DiesesImageUrl}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Meeting Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="meetingLink"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Google Meet Link<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="meetingLink"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="meetingScheduledTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Scheduled Date & Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="meetingScheduledTime"
                    value={meetingScheduledTime}
                    onChange={(e) => setMeetingScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Prescriptions</h2>
                <button
                  type="button"
                  onClick={addPrescription}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  + Add Medication
                </button>
              </div>

              {prescriptions.map((prescription, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-md mb-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Medication #{index + 1}</h3>
                    {prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medicine Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={prescription.medicineName}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "medicineName",
                            e.target.value
                          )
                        }
                        placeholder="Enter medicine name"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={prescription.dosage}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 1-0-1"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={prescription.duration}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 7 days"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <input
                        type="text"
                        value={prescription.notes}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder="After meals, etc."
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Common Medications Suggestions */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Common Medications</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    name: "Cetirizine 10mg",
                    dosage: "1-0-0",
                    duration: "7 days",
                    notes: "For itching",
                  },
                  {
                    name: "Calamine Lotion",
                    dosage: "Apply twice daily",
                    duration: "Until rash resolves",
                    notes: "For topical use",
                  },
                  {
                    name: "Acyclovir 400mg",
                    dosage: "1-1-1-1-1",
                    duration: "7 days",
                    notes: "Antiviral",
                  },
                  {
                    name: "Hydrocortisone Cream 1%",
                    dosage: "Apply twice daily",
                    duration: "5 days",
                    notes: "For inflammation",
                  },
                ].map((med, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      // Add this medication to the prescription list
                      setPrescriptions([...prescriptions, med]);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                  >
                    + {med.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Scheduling..." : "Schedule & Save Prescription"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScheduleConsult;
