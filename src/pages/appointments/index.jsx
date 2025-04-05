import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClent from "../../api/client";

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch doctors when component mounts
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiClent.get("/api/7788/getDermatologist");

      if (response.data.isSucess) {
        setDoctors(response.data.data || []);
      } else {
        throw new Error("Failed to fetch doctors");
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Unable to load doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
        <button
          onClick={fetchDoctors}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <h4 className="text-lg font-medium">Dermatologist</h4>

      {doctors.length === 0 ? (
        <div className="mt-4 text-gray-500 text-center">
          No dermatologists available at the moment.
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.ID} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  // Default values in case some properties are missing
  const {
    DermatologistID = "",
    FullName = "Dr. Unknown",
    Specialty = "Dermatologist",
    ImageUrl = "/doctor.jpeg",
    Rating = 3.6,
    IsOnline = true,
  } = doctor || {};

  // Calculate rating stars (1-5)
  const ratingStars = () => {
    const fullStars = Math.floor(Rating);
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<img key={`full-${i}`} src="/icons/star.svg" alt="★" />);
    }

    // Add empty stars
    for (let i = fullStars; i < 4; i++) {
      stars.push(<img key={`empty-${i}`} src="/icons/rate.svg" alt="☆" />);
    }

    return stars;
  };

  return (
    <div
      onClick={() => navigate(`/dashboard/doctor/${DermatologistID}`)}
      className="py-5 px-4 shadow-md border border-gray-100 cursor-pointer rounded-lg flex justify-between hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-x-3">
        <div className="w-[80px] h-[80px] overflow-hidden rounded-lg">
          <img
            src={ImageUrl}
            alt={FullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/doctor.jpeg"; // Fallback image
            }}
          />
        </div>
        <div className="flex flex-col gap-y-[6px]">
          <h4 className="font-medium">{FullName}</h4>
          <div className="flex items-center gap-x-2">
            <img src="/icons/dr.svg" alt="" />
            <span className="text-sm text-[#333333]/60 font-medium translate-y-0.5">
              {Specialty}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="font-medium">{Rating.toFixed(1)}</span>
            <div className="flex gap-x-2 items-center">{ratingStars()}</div>
          </div>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          IsOnline ? "text-[#229B59]" : "text-gray-500"
        }`}
      >
        {IsOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};

export default Appointments;
