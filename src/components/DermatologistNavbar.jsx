import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClent from "../api/client";

const DermNavbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [dermDetails, setDermDetails] = useState(null);
  const [slotDetails, setSlotDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");
  const [newSlotDay, setNewSlotDay] = useState("Monday");
  const [newSlotStartTime, setNewSlotStartTime] = useState("");
  const [newSlotEndTime, setNewSlotEndTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("dermatologistToken");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo)[0];
        setUserInfo(parsedUserInfo);
        fetchDermatologistDetails(parsedUserInfo.DermatologistID);
      } catch (error) {
        console.error("Error parsing user info:", error);
        setError("Failed to load user information");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    const handleClose = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setShowProfileDetails(false);
      }
    };

    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  const fetchDermatologistDetails = async (dermId) => {
    setIsLoading(true);
    setError(null);

    try {
      const dermResponse = await apiClent.get(`/api/7788/getDermatologist`, {
        headers: {
          ID: dermId,
        },
      });
      if (dermResponse.data && dermResponse.data.data?.length > 0) {
        setDermDetails(dermResponse.data.data[0]);
      }

      const slotsResponse = await apiClent.get(`/api/7788/getSlotsByID`, {
        headers: {
          drmID: parseInt(dermId),
        },
      });
      if (slotsResponse.data) {
        setSlotDetails(slotsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching dermatologist data:", error);
      setError("Failed to load dermatologist information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dermatologistToken");
    navigate("/dermoLogin");
  };

  const handleEditProfile = () => {
    setShowProfileDetails(!showProfileDetails);
  };

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot);
    setEditedStartTime(timeStringToInputFormat(slot.start_time));
    setEditedEndTime(timeStringToInputFormat(slot.end_time));
    setShowEditModal(true);
  };

  const handleAddNewSlot = () => {
    setShowAddSlotModal(true);
  };

  const handleUpdateSlot = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      if (!editedStartTime || !editedEndTime) {
        throw new Error("Both start and end times are required");
      }

      const formattedStartTime = inputTimeToAPIFormat(editedStartTime);
      const formattedEndTime = inputTimeToAPIFormat(editedEndTime);

      // Prepare all slots with the updated one
      const updatedSlots = slotDetails.map((slot) => {
        if (slot.availability_id === selectedSlot.availability_id) {
          return {
            availabilityID: slot.availability_id,
            dayOfWeek: selectedSlot.day_of_week, // Use the potentially updated day
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          };
        }
        return {
          availabilityID: slot.availability_id,
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
        };
      });

      const updateData = {
        availability: updatedSlots,
      };

      await apiClent.put("/api/7788/updatedermatologistSlot", updateData, {
        headers: {
          dermaID: userInfo.DermatologistID,
        },
      });

      fetchDermatologistDetails(userInfo.DermatologistID);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating slot:", error);
      setUpdateError(error.message || "Failed to update availability slot");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSlot = async (slotToDelete) => {
    if (
      !window.confirm("Are you sure you want to delete this availability slot?")
    ) {
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      // Filter out the deleted slot
      const remainingSlots = slotDetails
        .filter((slot) => slot.availability_id !== slotToDelete.availability_id)
        .map((slot) => ({
          availabilityID: slot.availability_id,
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
        }));

      const updateData = {
        availability: remainingSlots,
      };

      await apiClent.put("/api/7788/updatedermatologistSlot", updateData, {
        headers: {
          dermaID: userInfo.DermatologistID,
        },
      });

      fetchDermatologistDetails(userInfo.DermatologistID);
    } catch (error) {
      console.error("Error deleting slot:", error);
      setUpdateError(error.message || "Failed to delete availability slot");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSlot = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      if (!newSlotStartTime || !newSlotEndTime) {
        throw new Error("Both start and end times are required");
      }

      const formattedStartTime = inputTimeToAPIFormat(newSlotStartTime);
      const formattedEndTime = inputTimeToAPIFormat(newSlotEndTime);

      // Prepare all existing slots
      const existingSlots = slotDetails.map((slot) => ({
        availabilityID: slot.availability_id,
        dayOfWeek: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
      }));

      // Add the new slot with availabilityID as 0
      const newSlot = {
        availabilityID: 0, // 0 indicates a new slot
        dayOfWeek: newSlotDay,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };

      const updateData = {
        availability: [...existingSlots, newSlot],
      };

      await apiClent.put("/api/7788/updatedermatologistSlot", updateData, {
        headers: {
          dermaID: userInfo.DermatologistID,
        },
      });

      fetchDermatologistDetails(userInfo.DermatologistID);
      setShowAddSlotModal(false);
      setNewSlotDay("Monday");
      setNewSlotStartTime("");
      setNewSlotEndTime("");
    } catch (error) {
      console.error("Error adding new slot:", error);
      setUpdateError(error.message || "Failed to add new availability slot");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "";

      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;

      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const timeStringToInputFormat = (timeString) => {
    try {
      if (!timeString) return "";
      return timeString.substring(0, 5);
    } catch (error) {
      return "";
    }
  };

  const inputTimeToAPIFormat = (inputTime) => {
    return `${inputTime}:00`;
  };

  const renderProfileDetails = () => {
    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (error)
      return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
      <div
        ref={menuRef}
        className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-[350px] max-h-[500px] overflow-y-auto"
      >
        <h3 className="font-semibold text-lg mb-4 text-[#299392]">
          Profile Details
        </h3>

        {dermDetails && (
          <>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#D9D9D9] overflow-hidden mr-4">
                {dermDetails.ImageUrl && (
                  <img
                    src={dermDetails.ImageUrl}
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                )}
              </div>
              <div>
                <h4 className="font-semibold">{dermDetails.FullName}</h4>
                <p className="text-sm text-gray-600">{dermDetails.Specialty}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span>{dermDetails.ContactNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Login ID:</span>
                <span>{dermDetails.PortalLoginID}</span>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold mb-2">Description</h5>
              <p className="text-sm text-gray-700">{dermDetails.Description}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-semibold">Availability</h5>
                <button
                  onClick={handleAddNewSlot}
                  className="text-sm text-[#299392] hover:underline"
                >
                  + Add Slot
                </button>
              </div>
              {slotDetails.length > 0 ? (
                <div className="space-y-2">
                  {slotDetails.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-2 rounded flex justify-between items-center"
                    >
                      <span>{slot.day_of_week}</span>
                      <div className="flex items-center">
                        <span className="mr-2">
                          {formatTime(slot.start_time)} -{" "}
                          {formatTime(slot.end_time)}
                        </span>
                        <button
                          onClick={() => handleEditSlot(slot)}
                          className="w-6 h-6 flex items-center justify-center text-[#299392] hover:bg-gray-200 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No availability slots found
                </p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderEditModal = () => {
    if (!selectedSlot) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
          <h3 className="font-semibold text-lg mb-4 text-[#299392]">
            Edit Availability Slot
          </h3>

          {updateError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {updateError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of Week
              </label>
              <select
                value={selectedSlot.day_of_week}
                onChange={(e) =>
                  setSelectedSlot({
                    ...selectedSlot,
                    day_of_week: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded p-2"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={editedStartTime}
                onChange={(e) => setEditedStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={editedEndTime}
                onChange={(e) => setEditedEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => handleDeleteSlot(selectedSlot)}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400"
              disabled={isUpdating}
            >
              {isUpdating ? "Deleting..." : "Delete Slot"}
            </button>

            <div className="flex gap-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSlot}
                className="px-4 py-2 rounded bg-[#299392] text-white hover:bg-[#1E6F6D] disabled:bg-gray-400"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddSlotModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
          <h3 className="font-semibold text-lg mb-4 text-[#299392]">
            Add New Availability Slot
          </h3>

          {updateError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {updateError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of Week
              </label>
              <select
                value={newSlotDay}
                onChange={(e) => setNewSlotDay(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={newSlotStartTime}
                onChange={(e) => setNewSlotStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={newSlotEndTime}
                onChange={(e) => setNewSlotEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-x-3 mt-6">
            <button
              onClick={() => setShowAddSlotModal(false)}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleAddSlot}
              className="px-4 py-2 rounded bg-[#299392] text-white hover:bg-[#1E6F6D] disabled:bg-gray-400"
              disabled={isUpdating}
            >
              {isUpdating ? "Adding..." : "Add Slot"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="min-h-[66px] sticky top-0 z-50 bg-white flex items-center justify-between px-[60px] shadow-sm">
      <img
        src="/logo.svg"
        alt="Logo"
        className="cursor-pointer"
        onClick={() => navigate("/dermatologist")}
      />

      <div className="flex gap-x-2 relative items-center justify-end">
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        ) : userInfo ? (
          <>
            <div className="flex flex-col items-end">
              <h4 className="text-[#333333] text-sm">
                {userInfo?.FullName || "User"}
              </h4>
              <span className="text-xs text-[#333333]">
                {userInfo?.PortalLoginID || "user@example.com"}
              </span>
            </div>
            <div
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#D9D9D9] overflow-hidden cursor-pointer"
            >
              {userInfo?.ImageUrl && (
                <img
                  src={userInfo?.ImageUrl}
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
              )}
            </div>
          </>
        ) : (
          <Link
            to="/dermoLogin"
            className="text-sm hover:text-[#299392] cursor-pointer"
          >
            Login
          </Link>
        )}

        {isMenuOpen && userInfo && (
          <div className="w-[192px] absolute border border-gray-200 rounded-lg shadow-md p-5 py-1 bg-white flex flex-col top-full mt-3 right-0">
            <li
              onClick={handleEditProfile}
              className="flex items-center cursor-pointer py-4 border-b border-b-[#DDDDDD] gap-x-2 w-full"
            >
              <img src="/icons/edit.svg" alt="Edit" className="w-5 h-5" />
              <span className="text-sm">View Profile</span>
            </li>
            <li
              onClick={handleLogout}
              className="flex items-center cursor-pointer py-4 gap-x-2 w-full"
            >
              <img src="/icons/logout.svg" alt="Logout" />
              <span className="text-sm">Logout</span>
            </li>
          </div>
        )}

        {showProfileDetails && (
          <div className="absolute top-full right-0 mt-3 z-30">
            {renderProfileDetails()}
          </div>
        )}

        {showEditModal && renderEditModal()}
        {showAddSlotModal && renderAddSlotModal()}
      </div>
    </nav>
  );
};

export default DermNavbar;
