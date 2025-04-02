import React, { useState } from "react";
import AppointmentSuccessModal from "../../components/AppointmentSuccessModal";
import DoctorCard from "../../components/DoctorCard";
import NotesSection from "../../components/NoteSection";
import { useNavigate } from "react-router-dom";

// Sample data - moved outside component to avoid recreating on each render
const TIME_SLOTS = [
  "10:08 AM",
  "10:16 AM",
  "10:30 AM",
  "10:32 AM",
  "10:48 AM",
  "10:56 AM",
  "11:04 AM",
  "11:12 AM",
  "11:28 AM",
  "11:44 AM",
  "12:00 PM",
  "12:16 PM",
  "12:32 PM",
  "12:48 PM",
];

const DATE_OPTIONS = [
  "Today",
  "Tomorrow",
  "21/07/2025",
  "22/07/2025",
  "23/07/2025",
];

const MORNING_SLOTS = TIME_SLOTS.slice(0, 7);
const AFTERNOON_SLOTS = TIME_SLOTS.slice(7);

const SlotBooking = () => {
  const [selected, setSelected] = useState(null);
  const [level, setLevel] = useState("date");
  const [notes, setNotes] = useState("");
  const [isSuccess, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (level === "date") {
      setLevel("time");
    } else if (level === "time") {
      setLevel("notes");
    } else {
      // Handle final submission (e.g., API call with selected date, time, and notes)
      console.log("Appointment booked:", {
        date: selected,
        time: selected,
        notes,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/result");
      }, 3000);
    }
  };

  return (
    <div className="px-6 md:px-12 h-full flex flex-col justify-between py-6">
      <div>
        {/* Doctor Information Card */}
        <DoctorCard />

        {/* Date Selection */}
        {level === "date" && (
          <DateSelection
            dateOptions={DATE_OPTIONS}
            selected={selected}
            setSelected={setSelected}
          />
        )}

        {/* Time Selection */}
        {level === "time" && (
          <TimeSelection
            morningSlots={MORNING_SLOTS}
            afternoonSlots={AFTERNOON_SLOTS}
            selected={selected}
            setSelected={setSelected}
          />
        )}

        {/* Notes Section */}
        {level === "notes" && (
          <NotesSection notes={notes} setNotes={setNotes} />
        )}
      </div>
      <AppointmentSuccessModal
        isOpen={isSuccess}
        onClose={() => setSuccess(false)}
      />

      <button
        onClick={handleSubmit}
        className="bg-gray-500 hover:bg-gray-600 transition-colors cursor-pointer text-white font-medium py-4 rounded-lg w-full mt-6"
      >
        {level === "notes" ? "Book Appointment" : "Continue"}
      </button>
    </div>
  );
};

// Component for doctor information card

// Component for date selection
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
      <button className="px-4 py-2.5 flex items-center justify-center gap-x-2 text-sm rounded-lg border-2 border-gray-500/70 text-gray-500">
        <img src="/icons/calender.svg" alt="Calendar" />
        <span>Custom</span>
      </button>
    </div>
  </>
);

// Component for time selection
const TimeSelection = ({
  morningSlots,
  afternoonSlots,
  selected,
  setSelected,
}) => (
  <>
    <h4 className="text-lg font-medium mt-6">Choose Your Appointment Time</h4>

    {/* Morning slots */}
    <TimeSlotSection
      title="10:00 AM - 1:00 PM"
      slots={morningSlots}
      selected={selected}
      setSelected={setSelected}
    />

    {/* Afternoon slots */}
    <TimeSlotSection
      title="4:00 PM - 7:00 PM"
      slots={afternoonSlots}
      selected={selected}
      setSelected={setSelected}
    />
  </>
);

// Component for a group of time slots
const TimeSlotSection = ({ title, slots, selected, setSelected }) => (
  <>
    <div className="flex items-center gap-x-2 mt-5">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <hr className="flex-1 border-gray-300" />
    </div>
    <div className="flex flex-wrap gap-2 mt-4">
      {slots.map((time, index) => (
        <TimeButton
          key={index}
          time={time}
          isSelected={selected === time}
          onClick={() => setSelected(time)}
        />
      ))}
    </div>
  </>
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
