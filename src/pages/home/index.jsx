import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Banner from "../../components/banner";
import apiClent from "../../api/client";
import SkinDiagnosisChat from "../../components/SkinDiagnosisChat";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiClent.get("/api/7788/getDermatologist");

        if (response.data.isSucess) {
          setDoctors(response.data.data);
          setLoading(false);
        } else {
          setError("Failed to fetch doctors");
          setLoading(false);
        }
      } catch (err) {
        setError("Error fetching doctors");
        setLoading(false);
        console.error("Fetch doctors error:", err);
      }
    };

    fetchDoctors();
  }, []);

  // Star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex gap-x-2 items-center">
        {[...Array(fullStars)].map((_, index) => (
          <img key={`full-${index}`} src="/icons/star.svg" alt="full star" />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <img key={`empty-${index}`} src="/icons/rate.svg" alt="empty star" />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="px-[60px] flex flex-col py-6">
        <Banner />

        <h4 className="text-lg font-medium mt-9">Our Doctors</h4>
        <div className="w-full grid grid-cols-3 gap-5 mt-4">
          {doctors.map((doctor) => (
            <Link
              to={`/doctors/${doctor.DermatologistID}`}
              key={doctor.DermatologistID}
              className="py-5 px-4 shadow-md border border-gray-100 rounded-lg flex justify-between"
            >
              <div className="flex gap-x-3">
                <div className="w-[80px] h-[80px] overflow-hidden rounded-lg">
                  <img
                    src={
                      doctor?.ImageUrl?.length !== 0
                        ? doctor.ImageUrl
                        : "/doctor.jpeg"
                    }
                    alt={doctor.FullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex flex-col gap-y-[6px]">
                  <h4 className="font-medium">{doctor.FullName}</h4>
                  <div className="flex items-center gap-x-2">
                    <img src="/icons/dr.svg" alt="specialty icon" />
                    <span className="text-sm text-[#333333]/60 font-medium translate-y-0.5">
                      {doctor.Specialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    {/* <span className="font-medium">3.6</span> */}
                    {/* <StarRating rating={3} /> */}
                  </div>
                </div>
              </div>
              {/* <span className="text-sm font-medium text-[#229B59]">Online</span> */}
            </Link>
          ))}
        </div>
      </div>
      <SkinDiagnosisChat />
    </div>
  );
};

export default Home;
